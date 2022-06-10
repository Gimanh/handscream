<?php

namespace App\Classes\Auth;

use RuntimeException;
use ZXC\Native\Modules;
use App\Modules\AppConfig\AppConfig;
use ZXC\Modules\Auth\DataGenerators\AuthRemindPasswordUrlGenerator;

class AuthRemindUrlGenerator implements AuthRemindPasswordUrlGenerator
{
    protected string $code;

    protected string $login;

    protected string $urlTemplate;

    public function __construct(string $code, string $login)
    {
        $this->code = $code;
        $this->login = $login;
        /** @var AppConfig $appModule */
        $appModule = Modules::get('AppConfig');
        $this->urlTemplate = $appModule->getPublicConfig()['remindPasswordUrlTemplate'] ?? '';
        if (!$this->urlTemplate) {
            throw new RuntimeException("Parameter 'remindPasswordUrlTemplate' is empty");
        }
    }

    public function generate(): string
    {
        return str_replace(['{code}', '{login}'], [$this->code, $this->login], $this->urlTemplate);
    }
}
