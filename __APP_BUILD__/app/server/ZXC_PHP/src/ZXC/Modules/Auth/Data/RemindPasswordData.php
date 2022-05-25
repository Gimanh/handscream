<?php

namespace ZXC\Modules\Auth\Data;

use ZXC\Modules\Auth\Exceptions\InvalidRemindPasswordArgs;

class RemindPasswordData implements AuthenticableData
{

    protected string $code = '';

    protected string $email = '';

    protected int $time;

    /**
     * @param string $email
     * @throws InvalidRemindPasswordArgs
     */
    public function __construct(string $email)
    {
        $this->email = $email;
        $this->code = md5(uniqid(rand(), true) . $this->email);
        $this->time = time();
        $this->validate();
    }

    /**
     * @return bool
     * @throws InvalidRemindPasswordArgs
     */
    public function validate(): bool
    {
        if ($this->email && filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            return true;
        }
        throw new InvalidRemindPasswordArgs();
    }

    public function getData(): array
    {
        return [
            'login' => $this->email,
            'code' => $this->code,
            'time' => $this->time
        ];
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
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @return int
     */
    public function getTime(): int
    {
        return $this->time;
    }
}
