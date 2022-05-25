<?php


namespace ZXC\Native\PSR;


use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseFactoryInterface;


class ResponseFactory implements ResponseFactoryInterface
{

    public function createResponse(int $code = 200, string $reasonPhrase = ''): ResponseInterface
    {
        return new Response($code, [], 'php://memory', '1.1', $reasonPhrase);
    }
}
