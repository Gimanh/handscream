<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TaskUpdateStatus extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $parsedBody = $request->getParsedBody();
        $taskId = (int)$parsedBody['taskId'] ?? null;
        $complete = $parsedBody['complete'] ?? null;
        if ($taskId && $complete) {
            $complete = ($complete === 'true' || $complete === true);
            $task = $this->tasks->updateTaskComplete($taskId, $complete);
            if ($task) {
                return AppResponse::create($response, ['task' => $task], $request->getAttribute('rid'));
            }
        }
        return AppResponse::create($response, [], $request->getAttribute('rid'));
    }
}
