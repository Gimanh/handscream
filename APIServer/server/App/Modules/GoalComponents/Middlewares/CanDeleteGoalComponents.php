<?php

namespace App\Modules\GoalComponents\Middlewares;

use ZXC\Native\PSR\Response;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use App\Modules\GoalComponents\GoalComponentPermissions;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class CanDeleteGoalComponents extends BaseComponentMiddleware
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->initUser($request);
        if ($this->user) {
            $component = $this->goalComponents->getGoalComponent($request->getParsedBody()['listId']);
            if ($component->hasPermissions(GoalComponentPermissions::CAN_DELETE)) {
                return $handler->handle($request);
            }
        }
        return (new Response())->withStatus(403);
    }
}
