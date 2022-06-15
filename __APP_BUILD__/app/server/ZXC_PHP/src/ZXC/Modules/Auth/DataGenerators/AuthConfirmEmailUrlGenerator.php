<?php

namespace ZXC\Modules\Auth\DataGenerators;

interface AuthConfirmEmailUrlGenerator
{
    public function __construct(string $code, string $login);

    public function generate(): string;
}
