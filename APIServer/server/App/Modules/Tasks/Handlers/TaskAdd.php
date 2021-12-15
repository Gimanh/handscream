<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Modules\Auth\User;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TaskAdd extends TasksBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $parsedBody = $request->getParsedBody();
        $description = $parsedBody['description'] ?? '';
        $componentId = $parsedBody['componentId'] ?? null;
        /** @var $user User */
        $user = $request->getAttribute('user');
        $task = false;
        if ($description && $componentId !== null) {
            $task = $this->tasks->addTask($description, $componentId, $user->getId());
        }
        return AppResponse::create($response, ['add' => !!$task, 'task' => $task], $request->getAttribute('rid'));
    }
}
