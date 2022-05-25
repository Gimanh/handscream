<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TaskDelete extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $parsedBody = $request->getParsedBody();
        $taskId = $parsedBody['taskId'] ?? null;
        $delete = false;
        if ($taskId !== null) {
            $delete = $this->tasks->deleteTask((int)$taskId);
        }
        return AppResponse::create($response, ['delete' => $delete], $request->getAttribute('rid'));
    }
}
