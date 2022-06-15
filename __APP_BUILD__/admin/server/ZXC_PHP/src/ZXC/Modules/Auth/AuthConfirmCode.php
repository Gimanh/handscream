<?php

namespace ZXC\Modules\Auth;

use ZXC\Modules\Auth\Data\RegisterData;
use ZXC\Modules\Auth\DataGenerators\AuthConfirmEmailBodyGenerator;

interface AuthConfirmCode
{
    public function __construct(AuthConfirmEmailBodyGenerator $bodyGenerator, RegisterData $data);

    public function __invoke(): void;
}
