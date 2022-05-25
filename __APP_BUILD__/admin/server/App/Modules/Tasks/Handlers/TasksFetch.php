<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use App\Modules\Tasks\Args\FetchTasksArg;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TasksFetch extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $searchText = trim($request->getQueryParams()['searchText'] ?? '');
        $tasks = $this->tasks->fetchTasks(
            new FetchTasksArg($request->getQueryParams(), $this->tasks->getTasksLimit())
//                (int)$request->getQueryParams()['componentId'],
//                (int)$request->getQueryParams()['page'],
//                (int)$request->getQueryParams()['showCompleted'],
//                $searchText
            ) ?? [];
        return AppResponse::create($response, $tasks, $request->getAttribute('rid'));
    }
}
