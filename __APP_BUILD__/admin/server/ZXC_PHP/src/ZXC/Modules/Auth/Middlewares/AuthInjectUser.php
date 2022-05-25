<?php

namespace ZXC\Modules\Auth\Middlewares;

use ZXC\Native\Modules;
use ZXC\Modules\Auth\Auth;
use ZXC\Interfaces\IModule;
use ZXC\Modules\Auth\UserModel;
use ZXC\Interfaces\Psr\Server\MiddlewareInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class AuthInjectUser implements MiddlewareInterface
{
    /**
     * @var IModule|Auth
     */
    protected $auth = null;

    public function __construct()
    {
        $this->auth = Modules::get('auth');
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $user = $this->auth->retrieveFromRequest($request);
        if ($user instanceof UserModel) {
            $request = $request->withAttribute('user', $user);
            $this->auth->setUser($user);
        }

        return $handler->handle($request);
    }
}
