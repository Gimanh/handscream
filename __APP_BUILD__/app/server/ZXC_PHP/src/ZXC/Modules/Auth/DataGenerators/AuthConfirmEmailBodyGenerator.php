<?php

namespace ZXC\Modules\Auth\DataGenerators;

interface AuthConfirmEmailBodyGenerator
{
    public function __construct(AuthConfirmEmailUrlGenerator $authConfirmEmailUrlGenerator);

    public function generate(): string;
}
