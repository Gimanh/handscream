<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Modules\Auth\User;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TaskHistoryRecovery extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $data = $request->getParsedBody();
        if (isset($data['historyId'])) {
            return AppResponse::create($response, [
                'recovery' => !!$this->tasks->recoveryTaskHistory((int)$data['historyId'])
            ], $request->getAttribute('rid'));
        }
        return AppResponse::create($response, ['update' => false], $request->getAttribute('rid'));
    }
}
