<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TaskFetchSubtasks extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $taskId = $request->getQueryParams()['taskId'] ?? null;
        if ($taskId !== null) {
            $taskId = (int)$taskId;
            $subtasks = $this->tasks->fetchSubtasks($taskId);
            if ($subtasks) {
                return AppResponse::create($response, $subtasks, $request->getAttribute('rid'));
            }
        }
        return AppResponse::create($response, [], $request->getAttribute('rid'));
    }
}
