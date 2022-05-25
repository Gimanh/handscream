<?php

namespace ZXC\Modules\Auth\Data;

use ZXC\Modules\Auth\Exceptions\InvalidChangeRemindedPasswordArgs;

class ChangeRemindedPasswordData implements AuthenticableData
{

    protected string $login = '';

    protected string $code = '';

    protected string $firstNewPassword = '';

    protected string $confirmFirstPassword = '';

    /**
     * @param string $login
     * @param string $code
     * @param string $firstNewPassword
     * @param string $confirmFirstPassword
     * @throws InvalidChangeRemindedPasswordArgs
     */
    public function __construct(string $login, string $code, string $firstNewPassword, string $confirmFirstPassword)
    {
        $this->login = $login;
        $this->code = $code;
        $this->firstNewPassword = $firstNewPassword;
        $this->confirmFirstPassword = $confirmFirstPassword;
        $this->validate();
    }

    /**
     * @return bool
     * @throws InvalidChangeRemindedPasswordArgs
     */
    public function validate(): bool
    {
        if ($this->login && $this->code && $this->firstNewPassword === $this->confirmFirstPassword) {
            return true;
        }
        throw new InvalidChangeRemindedPasswordArgs();
    }

    public function getData(): array
    {
        return [
            'login' => $this->login,
            'code' => $this->code,
            'password' => $this->firstNewPassword,
        ];
    }

    /**
     * @return string
     */
    public function getLogin(): string
    {
        return $this->login;
    }

    /**
     * @return string
     */
    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->firstNewPassword;
    }
}
