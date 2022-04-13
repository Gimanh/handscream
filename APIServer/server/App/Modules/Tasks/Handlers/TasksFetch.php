<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TasksFetch extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $tasks = $this->tasks->fetchTasks(
                (int)$request->getQueryParams()['componentId'],
                (int)$request->getQueryParams()['page'],
                (int)$request->getQueryParams()['showCompleted']
            ) ?? [];
        return AppResponse::create($response, $tasks, $request->getAttribute('rid'));
    }
}
