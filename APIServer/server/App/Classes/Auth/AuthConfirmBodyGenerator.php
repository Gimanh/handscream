<?php

namespace App\Classes\Auth;

use App\Modules\AppConfig\AppConfig;
use RuntimeException;
use ZXC\Modules\Auth\DataGenerators\AuthConfirmEmailBodyGenerator;
use ZXC\Modules\Auth\DataGenerators\AuthConfirmEmailUrlGenerator;
use ZXC\Native\Modules;

class AuthConfirmBodyGenerator implements AuthConfirmEmailBodyGenerator
{
    protected AuthConfirmEmailUrlGenerator $urlGenerator;

    protected string $bodyTemplate;

    public function __construct(AuthConfirmEmailUrlGenerator $authConfirmEmailUrlGenerator)
    {
        $this->urlGenerator = $authConfirmEmailUrlGenerator;
        /** @var AppConfig $appModule */
        $appModule = Modules::get('AppConfig');
        $this->bodyTemplate = $appModule->getPublicConfig()['confirmEmailBodyTemplate'] ?? '';
        if (!$this->bodyTemplate) {
            throw new RuntimeException("Parameter 'confirmEmailBodyTemplate' is empty");
        }
    }

    public function generate(): string
    {
        return str_replace(['{link}'], [$this->urlGenerator->generate()], $this->bodyTemplate);
    }

}
