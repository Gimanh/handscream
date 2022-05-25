<?php

namespace App\Modules\Goals\Middlewares;

use ZXC\Native\PSR\Response;
use App\Modules\Goals\GoalPermissions;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class CanUpdateGoal extends BaseGoalMiddleware
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->initUser($request);
        if ($this->user) {
            $goal = $this->goals->getGoal($request->getParsedBody()['id']);
            if ($goal->hasPermissions(GoalPermissions::CAN_EDIT)) {
                return $handler->handle($request);
            }
        }
        return (new Response())->withStatus(400);
    }
}
