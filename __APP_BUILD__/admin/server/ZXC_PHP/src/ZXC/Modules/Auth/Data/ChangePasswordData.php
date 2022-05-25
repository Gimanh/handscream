<?php

namespace ZXC\Modules\Auth\Data;

use ZXC\Modules\Auth\Exceptions\InvalidChangePasswordArgs;

class ChangePasswordData implements AuthenticableData
{

    /**
     * @var string
     */
    protected $login = '';

    /**
     * @var string
     */
    protected $currentPassword = '';

    /**
     * @var string
     */
    protected $firstNewPassword = '';

    /**
     * @var string
     */
    protected $confirmFirstPassword = '';

    /**
     * @param string $login
     * @param string $currentPassword
     * @param string $firstNewPassword
     * @param string $confirmFirstPassword
     */
    public function __construct(
        string $login,
        string $currentPassword,
        string $firstNewPassword,
        string $confirmFirstPassword
    )
    {
        $this->login = $login;
        $this->currentPassword = $currentPassword;
        $this->firstNewPassword = $firstNewPassword;
        $this->confirmFirstPassword = $confirmFirstPassword;
    }

    /**
     * @return bool
     * @throws InvalidChangePasswordArgs
     */
    public function validate(): bool
    {
        if ($this->login && $this->currentPassword && $this->firstNewPassword === $this->confirmFirstPassword) {
            return true;
        }
        throw new InvalidChangePasswordArgs();
    }

    public function getData(): array
    {
        return [
            'login' => $this->login,
            'currentPassword' => $this->currentPassword,
            'newPassword' => $this->firstNewPassword,
        ];
    }
}
