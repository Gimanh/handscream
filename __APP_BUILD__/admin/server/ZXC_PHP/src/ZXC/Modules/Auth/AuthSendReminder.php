<?php

namespace ZXC\Modules\Auth;


use ZXC\Modules\Auth\DataGenerators\AuthRemindPasswordEmailBodyGenerator;

interface AuthSendReminder
{
    public function __construct(AuthRemindPasswordEmailBodyGenerator $bodyGenerator, string $email);

    public function __invoke(): bool;
}
