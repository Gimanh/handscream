<?php

namespace ZXC\Modules\Auth\Data;

use ZXC\Modules\Auth\Exceptions\InvalidEmail;
use ZXC\Modules\Auth\Exceptions\InvalidLogin;
use ZXC\Modules\Auth\Exceptions\InvalidPassword;
use ZXC\Modules\Auth\Exceptions\PasswordMismatch;

class RegisterData implements AuthenticableData
{
    protected string $login = '';

    protected string $email = '';

    protected string $password = '';

    protected string $passwordFirst = '';

    protected string $passwordSecond = '';

    protected string $confirmEmailCode = '';

    protected int $block = 0;

    /**
     * @param string $login
     * @param string $email
     * @param string $passwordFirst
     * @param string $passwordSecond
     * @throws InvalidEmail
     * @throws InvalidLogin
     * @throws InvalidPassword
     * @throws PasswordMismatch
     */
    public function __construct(
        string $login,
        string $email,
        string $passwordFirst,
        string $passwordSecond,
        int    $block
    )
    {
        $this->login = $login;
        $this->email = $email;
        $this->block = $block;
        $this->passwordFirst = $passwordFirst;
        $this->passwordSecond = $passwordSecond;
        $this->validate();
        $this->password = self::passwordHash($this->passwordFirst);
        $this->confirmEmailCode = md5(uniqid(rand(), true));
    }

    /**
     * @return bool
     * @throws InvalidEmail
     * @throws InvalidLogin
     * @throws InvalidPassword
     * @throws PasswordMismatch
     */
    public function validate(): bool
    {
        if ($this->passwordFirst !== $this->passwordSecond) {
            throw new PasswordMismatch();
        }

        if (!preg_match('/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/', $this->passwordFirst)) {
            throw new InvalidPassword();
        }

        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidEmail();
        }

        if (!preg_match('/^[a-z0-9]{4,30}$/', $this->login)) {
            throw new InvalidLogin();
        }
        return true;
    }

    public function getData(): array
    {
        return [
            'login' => $this->login,
            'email' => $this->email,
            'password' => $this->password,
            'block' => $this->block,
            'confirm_email_code' => $this->confirmEmailCode,
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
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @return string
     */
    public function getConfirmEmailCode(): string
    {
        return $this->confirmEmailCode;
    }

    /**
     * @return int
     */
    public function getBlock(): int
    {
        return $this->block;
    }

    public static function passwordHash($password)
    {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    }
}
