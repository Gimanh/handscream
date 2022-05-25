<?php


namespace ZXC\Native\PSR;


use ZXC\Interfaces\Psr\Http\Message\RequestInterface;
use ZXC\Interfaces\Psr\Http\Message\RequestFactoryInterface;


class RequestFactory implements RequestFactoryInterface
{

    public function createRequest(string $method, $uri): RequestInterface
    {
        return new Request($uri, $method);
    }
}
