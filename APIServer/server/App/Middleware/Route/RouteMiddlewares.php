<?php


namespace App\Middleware\Route;


use ZXC\Native\PSR\Response;
use ZXC\Interfaces\Psr\Http\Message\RequestInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;


class RouteMiddlewares
{
    public function myMiddleware(ServerRequestInterface $request, RequestHandlerInterface $handler)
    {
        $response = $handler->handle($request);
        $response->getBody()->write(' [middleware first======] ');
        return $response;
    }

    public function myMiddleware2(ServerRequestInterface $request, RequestHandlerInterface $handler)
    {
        $response = $handler->handle($request);
        $response->getBody()->write(' [middleware second] ');
        return $response;
    }

    public function notFound(RequestInterface $request)
    {
        return (new Response())->withStatus(404);
    }
}
