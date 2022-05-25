<?php

namespace App\Modules\Tasks\Middlewares;

use RuntimeException;
use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;
use ZXC\Modules\Auth\User;
use App\Modules\Tasks\Tasks;
use ZXC\Interfaces\Psr\Server\MiddlewareInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class BaseTaskMiddleware implements MiddlewareInterface
{
    protected ?DB $db = null;

    protected ?User $user = null;

    protected ?Tasks $tasks = null;

    public function __construct()
    {
        $this->db = Modules::get('db');
        $this->tasks = Modules::get('tasks');
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
