<?php

namespace App\Classes\Auth;

use App\Modules\AppConfig\AppConfig;
use RuntimeException;
use ZXC\Modules\Auth\DataGenerators\AuthRemindPasswordEmailBodyGenerator;
use ZXC\Modules\Auth\DataGenerators\AuthRemindPasswordUrlGenerator;
use ZXC\Native\Modules;

class AuthRemindBodyGenerator implements AuthRemindPasswordEmailBodyGenerator
{
    protected AuthRemindPasswordUrlGenerator $urlGenerator;

    protected string $bodyTemplate;

    public function __construct(AuthRemindPasswordUrlGenerator $authRemindPasswordUrlGenerator)
    {
        $this->urlGenerator = $authRemindPasswordUrlGenerator;
        /** @var AppConfig $appModule */
        $appModule = Modules::get('AppConfig');
        $this->bodyTemplate = $appModule->getPublicConfig()['remindPasswordBodyTemplate'] ?? '';
        if (!$this->bodyTemplate) {
            throw new RuntimeException("Parameter 'remindPasswordBodyTemplate' is empty");
        }
    }

    public function generate(): string
    {
        return str_replace(['{link}'], [$this->urlGenerator->generate()], $this->bodyTemplate);
    }
}
