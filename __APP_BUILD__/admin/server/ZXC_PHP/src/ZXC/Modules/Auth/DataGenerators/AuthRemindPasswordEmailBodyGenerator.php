<?php

namespace ZXC\Modules\Auth\DataGenerators;

interface AuthRemindPasswordEmailBodyGenerator
{
    public function __construct(AuthRemindPasswordUrlGenerator $authRemindPasswordUrlGenerator);

    public function generate(): string;
}
