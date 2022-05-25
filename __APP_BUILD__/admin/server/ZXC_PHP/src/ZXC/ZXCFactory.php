<?php


namespace ZXC;


class ZXCFactory
{
    public static function create(array $config): ZXC
    {
        return new ZXC($config);
    }
}
