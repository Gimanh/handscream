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
        $listId = $parsedBody['componentId'] ?? null;
        $parentId = $parsedBody['parentId'] ?? null;
        if ($parentId !== null) {
            $parentId = (int)$parentId;
        }
        /** @var $user User */
        $user = $request->getAttribute('user');
        $task = false;
        if ($description && $listId !== null) {
            $tasks = $this->tasks->addTask($description, $listId, $user->getId(), $parentId);
            if ($tasks) {
                $task = $tasks[0];
            }
        }
        return AppResponse::create($response, ['add' => !!$task, 'task' => $task], $request->getAttribute('rid'));
    }
}
