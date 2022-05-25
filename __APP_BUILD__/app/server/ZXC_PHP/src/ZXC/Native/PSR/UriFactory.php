<?php


namespace ZXC\Native\PSR;


use ZXC\Interfaces\Psr\Http\Message\UriInterface;
use ZXC\Interfaces\Psr\Http\Message\UriFactoryInterface;


class UriFactory implements UriFactoryInterface
{

    public function createUri(string $uri = ''): UriInterface
    {
        return new Uri($uri);
    }
}
