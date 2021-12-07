<?php

namespace App;

use ZXC\Native\PSR\Response;
use ZXC\Interfaces\Psr\Http\Message\RequestInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class AppNotFound
{
    public function notFound(RequestInterface $request): ResponseInterface
    {
        return (new Response())->withStatus(404);
    }
}
