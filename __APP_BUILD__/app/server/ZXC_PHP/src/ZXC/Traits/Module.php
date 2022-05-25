<?php

namespace ZXC\Traits;

trait Module
{
    public static function create(array $options = []): static
    {
        $instance = new static();
        $instance->init($options);
        return $instance;
    }
}
