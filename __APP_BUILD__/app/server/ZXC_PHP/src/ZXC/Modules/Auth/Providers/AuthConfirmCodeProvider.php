<?php

namespace ZXC\Modules\Auth\Providers;

use RuntimeException;
use ZXC\Modules\Auth\AuthConfirmCode;
use ZXC\Modules\Auth\DataGenerators\AuthConfirmEmailBodyGenerator;
use ZXC\Native\Modules;
use ZXC\Modules\Mailer\Mail;
use ZXC\Modules\Auth\Data\RegisterData;

class AuthConfirmCodeProvider implements AuthConfirmCode
{
    protected ?Mail $mailer;

    protected RegisterData $registerData;

    protected AuthConfirmEmailBodyGenerator $bodyGenerator;

    public function __construct(AuthConfirmEmailBodyGenerator $bodyGenerator, RegisterData $data)
    {
        $this->mailer = Modules::get('mail');
        if (!$this->mailer) {
            throw new RuntimeException('Module "Mail" is required for sending account conformation link.');
        }
        $this->registerData = $data;
        $this->bodyGenerator = $bodyGenerator;
    }

    public function __invoke(): void
    {
        $this->mailer
            ->addTo($this->registerData->getEmail(), $this->registerData->getEmail())
            ->setBody($this->bodyGenerator->generate())
            ->setSubject('Confirm registration')
            ->send();

    }
}
