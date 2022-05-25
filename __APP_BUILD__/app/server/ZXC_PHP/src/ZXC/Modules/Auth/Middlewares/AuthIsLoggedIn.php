<?php

namespace ZXC\Modules\Auth\Middlewares;

use ZXC\Modules\Auth\User;
use ZXC\Native\PSR\Response;
use ZXC\Interfaces\Psr\Server\MiddlewareInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class AuthIsLoggedIn implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        /** @var $user User | null */
        $user = $request->getAttribute('user');
        if ($user instanceof User) {
            if ($user->getId() && filter_var($user->getEmail(), FILTER_VALIDATE_EMAIL) && !$user->isBlocked()) {
                return $handler->handle($request);
            }
        }
        return (new Response())->withStatus(401);
    }
}
