<?php

namespace ZXC\Modules\Auth\Providers;

use RuntimeException;
use ZXC\Native\Modules;
use ZXC\Modules\Mailer\Mail;
use ZXC\Modules\Auth\Data\RegisterData;

class AuthConfirmCodeProvider
{
    protected ?Mail $mailer;

    public function __construct()
    {
        $this->mailer = Modules::get('mail');
        if (!$this->mailer) {
            throw new RuntimeException('Module "Mail" is required for sending account conformation link.');
        }
    }

    public function __invoke(RegisterData $data, ?string $confirmUrlTemplate, ?string $bodyTemplate)
    {
        $email = $data->getEmail();
        $code = $data->getConfirmEmailCode();
        $login = $data->getLogin();
        $url = str_replace(['{code}', '{login}'], [$code, $login], $confirmUrlTemplate);
        $url = "<a href='$url'>Confirm registration</a>";
        $body = str_replace(['{link}'], [$url], $bodyTemplate);
        $this->mailer
            ->addTo($email, $email)
            ->setBody($body)
            ->setSubject('Confirm registration')
            ->send();
    }
}
