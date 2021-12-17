<?php

namespace App\Modules\GoalComponents\Handlers;

use App\AppResponse;
use ZXC\Native\Modules;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use App\Modules\GoalComponents\GoalComponents;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class DeleteGoalList
{
    protected GoalComponents|null $goalComponents = null;

    public function __construct()
    {
        $this->goalComponents = Modules::get('GoalComponents');
    }

    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $params = $request->getParsedBody();
        $listId = $params['listId'] ?? null;
        if ($listId !== null) {
            $delete = $this->goalComponents->deleteList((int)$listId);
            return AppResponse::create($response, ['delete' => $delete], $request->getAttribute('rid'));
        }
        return AppResponse::create($response, [], $request->getAttribute('rid'));
    }
}
