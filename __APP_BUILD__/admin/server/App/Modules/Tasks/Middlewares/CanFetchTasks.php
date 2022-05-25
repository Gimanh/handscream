<?php

namespace App\Modules\Tasks\Middlewares;

use App\Modules\GoalComponents\GoalComponentPermissions;
use ZXC\Native\Modules;
use ZXC\Native\PSR\Response;
use App\Modules\GoalComponents\GoalComponents;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class CanFetchTasks extends BaseTaskMiddleware
{
    protected ?GoalComponents $goalComponents = null;

    public function __construct()
    {
        parent::__construct();
        $this->goalComponents = Modules::get('GoalComponents');
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->initUser($request);
        if ($this->user) {
            $component = $this->goalComponents->getGoalComponent($request->getQueryParams()['componentId']);
            if ($component->hasPermissions(GoalComponentPermissions::CAN_WATCH_CONTENT)) {
                return $handler->handle($request);
            }
        }
        return (new Response())->withStatus(403);
    }
}
