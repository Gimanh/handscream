<?php

namespace ZXC\Modules\Auth\DataGenerators;

class AuthConfirmUrlGenerator implements AuthConfirmEmailUrlGenerator
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
        return "/confirm/email/$this->code/login/$this->login";
    }
}
