<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TaskUpdateDescription extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $parsedBody = $request->getParsedBody();
        $taskId = (int)$parsedBody['taskId'] ?? null;
        $description = $parsedBody['description'] ?? null;
        if ($taskId && $description) {
            $task = $this->tasks->updateTaskDescription($taskId, $description);
            if ($task) {
                return AppResponse::create($response, ['task' => $task], $request->getAttribute('rid'));
            }
        }
        return AppResponse::create($response, [], $request->getAttribute('rid'));
    }
}
