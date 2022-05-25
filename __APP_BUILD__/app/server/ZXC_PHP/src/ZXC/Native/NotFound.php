<?php


namespace ZXC\Native;


use ZXC\Native\PSR\Response;
use ZXC\Interfaces\Psr\Http\Message\RequestInterface;


class NotFound
{
    public function notFound(RequestInterface $request)
    {
        return (new Response())->withStatus(404);
    }
}
