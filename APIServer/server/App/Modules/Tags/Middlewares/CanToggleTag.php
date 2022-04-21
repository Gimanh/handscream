<?php

namespace App\Modules\Tags\Middlewares;

use ZXC\Native\PSR\Response;
use App\Modules\Tasks\TaskPermissions;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class CanToggleTag extends BaseTagMiddleware
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $task = $this->tasks->getDetailedTask((int)$request->getParsedBody()['taskId']);
        if ($task->hasPermissions(TaskPermissions::CAN_EDIT_TAGS)) {
            return $handler->handle($request);
        }
        return (new Response())->withStatus(403);
    }
}
