<?php

namespace ZXC\Modules\Auth\Providers;

use RuntimeException;
use ZXC\Modules\Auth\AuthSendReminder;
use ZXC\Modules\Auth\DataGenerators\AuthRemindPasswordEmailBodyGenerator;
use ZXC\Modules\Mailer\Mail;
use ZXC\Native\Modules;

class AuthSendReminderLink implements AuthSendReminder
{
    protected ?Mail $mailer;

    protected AuthRemindPasswordEmailBodyGenerator $bodyGenerator;

    protected string $email;

    public function __construct(AuthRemindPasswordEmailBodyGenerator $bodyGenerator, string $email)
    {
        $this->mailer = Modules::get('mail');
        if (!$this->mailer) {
            throw new RuntimeException('Module "Mail" is required for sending recovery password link.');
        }
        $this->bodyGenerator = $bodyGenerator;
        $this->email = $email;
    }

    public function __invoke(): bool
    {
        $body = $this->bodyGenerator->generate();
        return $this->mailer
            ->addTo($this->email, $this->email)
            ->setBody($body)
            ->setSubject('Recovery passord')
            ->send();
    }
}
