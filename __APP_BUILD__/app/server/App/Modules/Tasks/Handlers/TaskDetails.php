<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TaskDetails extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $params = $request->getParsedBody();
        $taskId = $params['taskId'] ?? null;
        if ($taskId) {
            $task = $this->tasks->getDetailedTask((int)$taskId);
            return AppResponse::create($response, [$task], $request->getAttribute('rid'));
        }
        return AppResponse::create($response, [], $request->getAttribute('rid'), 400);
    }
}
