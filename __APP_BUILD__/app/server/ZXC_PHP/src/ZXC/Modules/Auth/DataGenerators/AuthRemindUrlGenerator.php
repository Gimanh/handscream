<?php

namespace ZXC\Modules\Auth\DataGenerators;

class AuthRemindUrlGenerator implements AuthRemindPasswordUrlGenerator
{
    protected string $code;

    protected string $login;

    public function __construct(string $code, string $login)
    {
        $this->code = $code;
        $this->login = $login;
    }

    public function generate(): string
    {
        return "/new/password/$this->code/$this->login";
    }
}
