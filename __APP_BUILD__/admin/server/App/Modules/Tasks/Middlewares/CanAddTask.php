<?php

namespace App\Modules\Tasks\Middlewares;

use App\Modules\GoalComponents\GoalComponentPermissions;
use App\Modules\GoalComponents\GoalComponents;
use App\Modules\Tasks\TaskPermissions;
use ZXC\Native\Modules;
use ZXC\Native\PSR\Response;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class CanAddTask extends BaseTaskMiddleware
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
            $component = $this->goalComponents->getGoalComponent($request->getParsedBody()['componentId']);
            if ($component->hasPermissions(GoalComponentPermissions::CAN_ADD_TASKS) ||
                $component->hasPermissions(GoalComponentPermissions::CAN_ADD_SUBTASKS)) {
                if ($this->addingSubtask($request)) {
                    $task = $this->tasks->getDetailedTask($request->getParsedBody()['parentId']);
                    if ($task->hasPermissions(TaskPermissions::CAN_ADD_SUBTASKS) ||
                        $component->hasPermissions(GoalComponentPermissions::CAN_ADD_SUBTASKS)) {
                        return $handler->handle($request);
                    }
                } else {
                    return $handler->handle($request);
                }
            }
        }
        return (new Response())->withStatus(403);
    }

    public function addingSubtask(ServerRequestInterface $request): bool
    {
        return isset($request->getParsedBody()['parentId']);
    }
}
