<?php

namespace App\Modules\Tasks\Middlewares;

use ZXC\Native\PSR\Response;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class CanDeleteTask extends BaseTaskMiddleware
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->initUser($request);
        if ($this->user) {
            $task = $this->db->selectOne(
                'SELECT owner FROM tasks.tasks WHERE id = ? AND owner = ?;',
                [$request->getParsedBody()['taskId'], $this->user->getId()]
            );
            if ($task) {
                return $handler->handle($request);
            }
        }
        return (new Response())->withStatus(400);
    }
}
