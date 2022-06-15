<?php

namespace ZXC\Modules\Auth;

use RuntimeException;
use ZXC\Traits\Module;
use ZXC\Interfaces\IModule;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Modules\Auth\Data\LoginData;
use ZXC\Modules\Auth\Data\RegisterData;
use ZXC\Modules\Auth\Data\ConfirmEmailData;
use ZXC\Modules\Auth\Data\RemindPasswordData;
use ZXC\Modules\Auth\Data\ChangePasswordData;
use ZXC\Modules\Auth\Storages\AuthPgSqlStorage;
use ZXC\Modules\Auth\Exceptions\InvalidAuthConfig;
use ZXC\Modules\Auth\Providers\AuthSendReminderLink;
use ZXC\Modules\Auth\Providers\AuthJwtTokenProvider;
use ZXC\Interfaces\Psr\Http\Message\RequestInterface;
use ZXC\Modules\Auth\Data\ChangeRemindedPasswordData;
use ZXC\Modules\Auth\Providers\AuthConfirmCodeProvider;
use ZXC\Modules\Auth\DataGenerators\AuthRemindUrlGenerator;
use ZXC\Modules\Auth\DataGenerators\AuthConfirmUrlGenerator;
use ZXC\Modules\Auth\DataGenerators\AuthRemindBodyGenerator;
use ZXC\Modules\Auth\DataGenerators\AuthConfirmBodyGenerator;
use ZXC\Modules\Auth\DataGenerators\AuthConfirmEmailUrlGenerator;
use ZXC\Modules\Auth\DataGenerators\AuthConfirmEmailBodyGenerator;
use ZXC\Modules\Auth\DataGenerators\AuthRemindPasswordUrlGenerator;
use ZXC\Modules\Auth\DataGenerators\AuthRemindPasswordEmailBodyGenerator;

class Auth implements Authenticable, IModule
{
    use Module;

    const USER_BLOCKED = 1;

    const USER_UNBLOCKED = 0;

    const AUTH_TYPE_JWT = 'jwt';
    /**
     * @var null | AuthStorage
     */
    protected ?AuthStorage $storageProvider = null;

    /**
     * If true confirm email will be sent to user email
     * @var bool
     */
    protected bool $confirmEmail = true;

    /**
     * Handler which will send code to user email
     */
    protected string $codeProvider = AuthConfirmCodeProvider::class;

    /**
     * @var null | User
     */
    protected ?User $user = null;

    /**
     * @var null | AuthLoginProvider
     */
    protected ?AuthLoginProvider $authProvider = null;

    /**
     * User class instance of this class will be created must extend UserModel
     * @var string
     */
    protected string $userClass = 'ZXC\Modules\Auth\User';

    protected string $confirmUrlGenerator = AuthConfirmUrlGenerator::class;

    protected string $confirmEmailBodyGenerator = AuthConfirmBodyGenerator::class;

    /**
     * If true user will be blocked after registration before email will be confirmed
     * @var bool
     */
    protected bool $blockWithoutEmailConfirm = true;

    protected int $remindPasswordInterval = 2;

    protected string $remindPasswordUrlGenerator = AuthRemindUrlGenerator::class;

    protected string $remindPasswordEmailBodyGenerator = AuthRemindBodyGenerator::class;

    protected string $remindPasswordLinkProvider = AuthSendReminderLink::class;

    /**
     * @param array $options
     * @throws InvalidAuthConfig
     */
    public function init(array $options = [])
    {
        if (!isset($options['storageProvider'])) {
            $this->storageProvider = new AuthPgSqlStorage();
        } else {
            $this->storageProvider = new $options['storageProvider']();
        }

        $this->confirmEmail = $options['email']['confirm'] ?? true;

        $this->codeProvider = $options['email']['codeProvider'] ?? null;

        $this->confirmUrlGenerator = $options['email']['confirmUrlGenerator'] ?? AuthConfirmUrlGenerator::class;

        $this->throwExceptionIfNotImplemented($this->confirmUrlGenerator, AuthConfirmEmailUrlGenerator::class);

        $this->confirmEmailBodyGenerator = $options['email']['confirmBodyGenerator'] ?? AuthConfirmBodyGenerator::class;

        $this->throwExceptionIfNotImplemented($this->confirmEmailBodyGenerator, AuthConfirmEmailBodyGenerator::class);

        $this->blockWithoutEmailConfirm = $options['blockWithoutEmailConfirm'] ?? true;

        $this->remindPasswordInterval = $options['remindPasswordInterval'] ?? 2;

        $this->remindPasswordUrlGenerator = $options['remindPasswordUrlGenerator'] ?? AuthRemindUrlGenerator::class;

        $this->throwExceptionIfNotImplemented($this->remindPasswordUrlGenerator, AuthRemindPasswordUrlGenerator::class);

        $this->remindPasswordLinkProvider = $options['remindPasswordLinkProvider'] ?? AuthSendReminderLink::class;

        $this->remindPasswordEmailBodyGenerator = $options['remindPasswordEmailBodyGenerator'] ?? AuthRemindBodyGenerator::class;

        $this->throwExceptionIfNotImplemented($this->remindPasswordEmailBodyGenerator, AuthRemindPasswordEmailBodyGenerator::class);

        $this->authProvider = new $options['authTypeProvider']($options['authTypeProviderOptions'] ?? [], $this)
            ?? new AuthJwtTokenProvider($options['authTypeProviderOptions'] ?? [], $this);

        if (isset($options['userClass'])) {
            $this->userClass = $options['userClass'];
        }
    }

    public function checkImplementation(object|string $objectOrClass, string $needle): bool
    {
        $implementations = class_implements($objectOrClass, true);
        return in_array($needle, $implementations);
    }

    public function throwExceptionIfNotImplemented(object|string $objectOrClass, string $needle)
    {
        if (!$this->checkImplementation($objectOrClass, $needle)) {
            throw new RuntimeException("Object $objectOrClass must implement $needle");
        }
    }

    public function login(LoginData $data): array
    {
        if ($data->isEmail()) {
            $userInfo = $this->storageProvider->fetchUserByEmail($data->getLoginOrEmail());
        } else {
            $userInfo = $this->storageProvider->fetchUserByLogin($data->getLoginOrEmail());
        }
        if ($userInfo && $userInfo['block'] === Auth::USER_UNBLOCKED) {
            if (password_verify($data->getPassword(), $userInfo['password'])) {
                $permissions = $this->storageProvider->fetchUserPermissions($userInfo['id']);
                $this->user = new $this->userClass($userInfo['id'], $userInfo['login'], $userInfo['email'], $userInfo['block'], $permissions);
                return $this->authProvider->login($this->user->getInfo());
            }
        }
        return [];
    }

    public function register(RegisterData $data): array
    {
        $inserted = $this->storageProvider->insertUser($data);
        if ($inserted === AuthStorage::USER_NOT_INSERTED) {
            return ['registration' => false, 'confirmEmail' => false];
        }
        if ($this->confirmEmail && $this->codeProvider) {
            $this->callCodeProvider($data);
        }
        return ['registration' => true, 'confirmEmail' => $this->confirmEmail && $this->codeProvider];
    }

    public function callCodeProvider(RegisterData $data)
    {
        call_user_func(new $this->codeProvider(
            new $this->confirmEmailBodyGenerator(
                new $this->confirmUrlGenerator(
                    $data->getConfirmEmailCode(), $data->getLogin()
                )
            ), $data
        ));
    }

    public function confirmEmail(ConfirmEmailData $data): bool
    {
        $user = $this->storageProvider->fetchUserByLogin($data->getLogin());
        if ($user) {
            if ($user['login'] === $data->getLogin() && $user['confirm_email_code'] === $data->getCode()) {
                return $this->storageProvider->confirmEmail($data->getLogin(), $data->getCode(), Auth::USER_UNBLOCKED);
            }
        }
        return false;
    }

    public function canSendReminder(array $userData): bool
    {
        if (!isset($user['remind_password_code']) && !isset($user['remind_password_time'])) {
            return true;
        }
        if (isset($user['remind_password_code']) && isset($user['remind_password_time'])) {
            if ($user['remind_password_time'] + ($this->remindPasswordInterval * 60) < time()) {
                return true;
            }
        }
        return false;
    }

    public function getReminderLinkProviderInstance(string $login, string $code, string $email)
    {
        return new $this->remindPasswordLinkProvider(
            new $this->remindPasswordEmailBodyGenerator(
                new $this->remindPasswordUrlGenerator($code, $login)
            ), $email);
    }

    public function remindPassword(RemindPasswordData $data): bool
    {
        $user = $this->storageProvider->fetchUserByEmail($data->getEmail());
        if ($user) {
            if ($this->canSendReminder($user)) {
                $saveResult = $this->storageProvider->setReminderCodeAndTime($data->getEmail(), $data->getCode(), $data->getTime());
                if ($saveResult) {
                    $providerResult = call_user_func($this->getReminderLinkProviderInstance(
                        $user['login'],
                        $data->getCode(),
                        $data->getEmail()
                    ));
                    return !!$providerResult;
                }
            }
        }
        return false;
    }

    public function changeRemindedPassword(ChangeRemindedPasswordData $data): bool
    {
        $user = $this->storageProvider->fetchUserByLogin($data->getLogin());
        if ($user) {
            if ($user['remind_password_code'] === $data->getCode()) {
                $password = password_hash($data->getPassword(), PASSWORD_BCRYPT, ['cost' => 10]);
                $updateResult = $this->storageProvider->updateUserPassword($password, $user['id']);
                if ($updateResult) {
                    $this->storageProvider->setReminderCodeAndTime($user['email'], null, null);
                }
                return $updateResult;
            }
        }
        return false;
    }

    /**
     * @param ChangePasswordData $data
     * @return void
     */
    public function changePassword(ChangePasswordData $data)
    {
        // TODO: Implement changePassword() method.
    }

    /**
     * @param ServerRequest $request
     * @return bool
     */
    public function logout(ServerRequest $request): bool
    {
        $header = $request->getHeaderLine('Authorization');
        if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            return $this->authProvider->logout($this->user->getId(), $matches[1]);
        }
        return false;
    }

    /**
     * @param RequestInterface $request
     * @return UserModel|null
     */
    public function retrieveFromRequest(RequestInterface $request): ?UserModel
    {
        return $this->authProvider->retrieveUserFromRequest($request);
    }

    /**
     * @return UserModel|null
     */
    public function getUser(): ?UserModel
    {
        return $this->user;
    }

    /**
     * @return AuthLoginProvider
     */
    public function getAuthProvider(): AuthLoginProvider
    {
        return $this->authProvider;
    }

    /**
     * @return AuthStorage|null
     */
    public function getStorageProvider(): ?AuthStorage
    {
        return $this->storageProvider;
    }

    /**
     * @param User|null $user
     */
    public function setUser(?User $user): void
    {
        $this->user = $user;
    }

    /**
     * @return string
     */
    public function getUserClass(): string
    {
        return $this->userClass;
    }

    /**
     * @return string
     */
    public function getConfirmUrlTemplate(): string
    {
        return $this->confirmUrlGenerator;
    }

    /**
     * @return bool
     */
    public function isBlockWithoutEmailConfirm(): bool
    {
        return $this->blockWithoutEmailConfirm;
    }
}
