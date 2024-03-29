<?php

namespace App\Modules\GoalComponents\Middlewares;

use RuntimeException;
use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;
use ZXC\Modules\Auth\User;
use App\Modules\GoalComponents\GoalComponents;
use ZXC\Interfaces\Psr\Server\MiddlewareInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class BaseComponentMiddleware implements MiddlewareInterface
{
    protected ?DB $db = null;

    protected ?User $user = null;

    protected ?GoalComponents $goalComponents = null;

    public function __construct()
    {
        $this->db = Modules::get('db');
        $this->goalComponents = Modules::get('GoalComponents');
    }

    protected function initUser(ServerRequestInterface $request)
    {
        $this->user = $request->getAttribute('user');
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        throw new RuntimeException('Implement process() method in ' . static::class . '.');
    }
}
