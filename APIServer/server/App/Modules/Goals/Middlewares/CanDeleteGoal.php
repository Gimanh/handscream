<?php

namespace App\Modules\Goals\Middlewares;

use ZXC\Native\PSR\Response;
use App\Modules\Tasks\Middlewares\BaseTaskMiddleware;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class CanDeleteGoal extends BaseTaskMiddleware
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->initUser($request);
        if ($this->user) {
            $goal = $this->db->selectOne(
                'SELECT owner FROM tasks.goals WHERE id = ? AND owner = ?;',
                [$request->getParsedBody()['goalId'], $this->user->getId()]
            );
            if ($goal) {
                return $handler->handle($request);
            }
        }
        return (new Response())->withStatus(400);
    }
}
