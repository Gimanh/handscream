<?php

namespace App\Modules\Goals\Middlewares;

use RuntimeException;
use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;
use ZXC\Modules\Auth\User;
use App\Modules\Goals\Goals;
use ZXC\Interfaces\Psr\Server\MiddlewareInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class BaseGoalMiddleware implements MiddlewareInterface
{
    protected ?DB $db = null;

    protected ?User $user = null;

    protected ?Goals $goals = null;

    public function __construct()
    {
        $this->db = Modules::get('db');
        $this->goals = Modules::get('goals');
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
