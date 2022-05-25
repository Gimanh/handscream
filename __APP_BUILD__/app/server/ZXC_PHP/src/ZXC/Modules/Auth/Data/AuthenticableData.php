<?php


namespace ZXC\Modules\Auth\Data;


use InvalidArgumentException;


interface AuthenticableData
{
    public function validate(): bool;

    public function getData(): array;
}
