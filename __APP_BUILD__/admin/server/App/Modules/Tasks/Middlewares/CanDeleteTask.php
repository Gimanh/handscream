<?php

namespace App\Modules\Tasks\Middlewares;

use ZXC\Native\PSR\Response;
use App\Modules\Tasks\TaskPermissions;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class CanDeleteTask extends BaseTaskMiddleware
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->initUser($request);
        if ($this->user) {
            $task = $this->tasks->getDetailedTask($request->getParsedBody()['taskId']);
            if ($task->hasPermissions(TaskPermissions::CAN_DELETE)) {
                return $handler->handle($request);
            }
        }
        return (new Response())->withStatus(403);
    }
}
