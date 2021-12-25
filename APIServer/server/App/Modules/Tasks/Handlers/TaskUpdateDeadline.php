<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TaskUpdateDeadline extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $parsedBody = $request->getParsedBody();
        $taskId = (int)$parsedBody['taskId'] ?? null;
        $deadline = $parsedBody['deadline'] ?? null;
        $deadline = trim($deadline);
        $updateResult = false;
        if ($taskId && $deadline) {
            $updateResult = $this->tasks->updateTaskDeadline($taskId, $deadline);
        }
        return AppResponse::create($response, ['update' => $updateResult], $request->getAttribute('rid'));
    }
}
