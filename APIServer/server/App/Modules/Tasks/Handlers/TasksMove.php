<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Native\RouteParams;

class TasksMove extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $params = $request->getParsedBody();
        $move = $this->tasks->moveTask((int)$params['taskId'], (int)$params['listId']);
        return AppResponse::create($response, ['move' => $move], $request->getAttribute('rid'));
    }
}
