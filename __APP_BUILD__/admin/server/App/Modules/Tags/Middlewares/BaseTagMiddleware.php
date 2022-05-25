<?php

namespace App\Modules\Tags\Middlewares;

use RuntimeException;
use ZXC\Modules\Auth\User;
use ZXC\Native\Modules;
use App\Modules\Tasks\Tasks;
use ZXC\Interfaces\Psr\Server\MiddlewareInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class BaseTagMiddleware implements MiddlewareInterface
{
    protected ?Tasks $tasks = null;

    protected ?User $user = null;

    public function __construct()
    {
        $this->tasks = Modules::get('tasks');
        $this->user = $this->tasks->getUser();
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        throw new RuntimeException('Implement process() method in ' . static::class . '.');
    }
}
