<?php

namespace ZXC\Modules\Auth;

use ZXC\Modules\Auth\Storages\AuthPgSqlStorage;
use ZXC\Traits\Module;
use ZXC\Native\CallHandler;
use ZXC\Interfaces\IModule;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Modules\Auth\Data\LoginData;
use ZXC\Modules\Auth\Data\RegisterData;
use ZXC\Modules\Auth\Data\ConfirmEmailData;
use ZXC\Modules\Auth\Data\RemindPasswordData;
use ZXC\Modules\Auth\Data\ChangePasswordData;
use ZXC\Modules\Auth\Exceptions\InvalidAuthConfig;
use ZXC\Modules\Auth\Providers\AuthJwtTokenProvider;
use ZXC\Interfaces\Psr\Http\Message\RequestInterface;
use ZXC\Modules\Auth\Data\ChangeRemindedPasswordData;

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
    protected string $codeProvider = 'ZXC\Modules\Auth\Providers\AuthConfirmCodeProvider';

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

    protected string $confirmUrlTemplate;

    protected string $confirmEmailBody = '{link}';

    /**
     * If true user will be blocked after registration before email will be confirmed
     * @var bool
     */
    protected bool $blockWithoutEmailConfirm = true;

    protected int $remindPasswordInterval = 2;

    protected string $remindPasswordLinkTemplate = '/new/password/{code}/{login}';

    protected string $remindPasswordEmailBody = '{link}';

    protected string $remindPasswordLinkProvider = 'ZXC\Modules\Auth\Providers\AuthSendReminderLink';

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

        $this->confirmUrlTemplate = $options['email']['confirmUrlTemplate'] ?? null;

        $this->confirmEmailBody = $options['email']['body'];

        $this->blockWithoutEmailConfirm = $options['blockWithoutEmailConfirm'] ?? true;

        $this->remindPasswordInterval = $options['remindPasswordInterval'] ?? 2;

        $this->remindPasswordLinkTemplate = $options['remindPasswordLinkTemplate'] ?? '/new/password/{code}/{login}';

        $this->remindPasswordLinkProvider = $options['remindPasswordLinkProvider'] ?? 'ZXC\Modules\Auth\Providers\AuthSendReminderLink';

        $this->remindPasswordEmailBody = $options['remindPasswordEmailBody'] ?? '{link}';

        $this->authProvider = new $options['authTypeProvider']($options['authTypeProviderOptions'] ?? [], $this)
            ?? new AuthJwtTokenProvider($options['authTypeProviderOptions'] ?? [], $this);

        if (isset($options['userClass'])) {
            $this->userClass = $options['userClass'];
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
            CallHandler::execHandler($this->codeProvider, [$data, $this->confirmUrlTemplate, $this->confirmEmailBody]);
        }
        return ['registration' => true, 'confirmEmail' => $this->confirmEmail && $this->codeProvider];
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

    public function remindPassword(RemindPasswordData $data): bool
    {
        $user = $this->storageProvider->fetchUserByEmail($data->getEmail());
        if ($user) {
            if (!isset($user['remind_password_code']) && !isset($user['remind_password_time'])) {
                $saveResult = $this->storageProvider->setReminderCodeAndTime($data->getEmail(), $data->getCode(), $data->getTime());
                if ($saveResult) {
                    $saveResult = call_user_func_array(new $this->remindPasswordLinkProvider, [
                        $data->getEmail(),
                        $this->remindPasswordLinkTemplate,
                        $this->remindPasswordEmailBody,
                        $data->getCode(),
                        $user['login']
                    ]);
                }
                return $saveResult;
            }
            if (isset($user['remind_password_code']) && isset($user['remind_password_time'])) {
                if ($user['remind_password_time'] + ($this->remindPasswordInterval * 60) < time()) {
                    $saveResult = $this->storageProvider->setReminderCodeAndTime($data->getEmail(), $data->getCode(), $data->getTime());
                    if ($saveResult) {
                        $saveResult = call_user_func_array(new $this->remindPasswordLinkProvider, [
                            $data->getEmail(),
                            $this->remindPasswordLinkTemplate,
                            $this->remindPasswordEmailBody,
                            $data->getCode(),
                            $user['login']
                        ]);
                    }
                    return $saveResult;
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
        return $this->confirmUrlTemplate;
    }

    /**
     * @return bool
     */
    public function isBlockWithoutEmailConfirm(): bool
    {
        return $this->blockWithoutEmailConfirm;
    }
}
