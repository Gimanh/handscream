<?php

namespace App\Modules\Tasks\Middlewares;

use ZXC\Native\PSR\Response;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class CanAddTask extends BaseTaskMiddleware
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->initUser($request);
        if ($this->user) {
            $goalComponent = $this->db->selectOne(
                'SELECT owner FROM tasks.goal_lists WHERE id = ? AND owner = ?;',
                [$request->getParsedBody()['componentId'], $this->user->getId()]
            );
            if ($goalComponent) {
                return $handler->handle($request);
            }
        }
        return (new Response())->withStatus(400);
    }
}
