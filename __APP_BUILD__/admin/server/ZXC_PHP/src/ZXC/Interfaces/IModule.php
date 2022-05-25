<?php


namespace ZXC\Interfaces;


interface IModule
{
    public static function create(array $options = []);

    public function init(array $options = []);
}
