<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TaskUpdateNote extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $parsedBody = $request->getParsedBody();
        $taskId = (int)$parsedBody['taskId'] ?? null;
        $note = $parsedBody['note'] ?? null;
        $updateResult = false;
        if ($taskId && $note !== null) {
            $updateResult = $this->tasks->updateTaskNote($taskId, $note);
        }
        return AppResponse::create($response, ['update' => $updateResult], $request->getAttribute('rid'));
    }
}
