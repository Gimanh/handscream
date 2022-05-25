<?php

namespace ZXC\Modules\Auth\Providers;

use RuntimeException;
use ZXC\Native\Modules;
use ZXC\Modules\Mailer\Mail;

class AuthSendReminderLink
{
    protected ?Mail $mailer;

    public function __construct()
    {
        $this->mailer = Modules::get('mail');
        if (!$this->mailer) {
            throw new RuntimeException('Module "Mail" is required for sending recovery password link.');
        }
    }

    public function __invoke($email, $link, $body, $code, $login): bool
    {
        $url = str_replace(['{code}', '{login}'], [$code, $login], $link);
        $url = "<a href='$url'>Enter new password</a>";
        $body = str_replace(['{link}'], [$url], $body);
        return $this->mailer
            ->addTo($email, $email)
            ->setBody($body)
            ->setSubject('Recovery passord')
            ->send();
    }
}
