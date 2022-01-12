<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Native\RouteParams;

class TasksFetch extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $tasks = $this->tasks->fetchTasks((int)$request->getQueryParams()['componentId']) ?? [];
        return AppResponse::create($response, $tasks, $request->getAttribute('rid'));
    }
}
