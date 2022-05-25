<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Modules\Auth\User;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TaskPriorityUpdate extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $data = $request->getParsedBody();
        if (isset($data['taskId']) && isset($data['priorityId'])) {
            return AppResponse::create($response, [
                'update' => $this->tasks->updatePriority((int)$data['taskId'], (int)$data['priorityId'])
            ], $request->getAttribute('rid'));
        }
        return AppResponse::create($response, ['update' => false], $request->getAttribute('rid'));
    }
}
