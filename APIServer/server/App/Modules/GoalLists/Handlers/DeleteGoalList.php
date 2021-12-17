<?php

namespace App\Modules\GoalLists\Handlers;

use App\AppResponse;
use ZXC\Native\Modules;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use App\Modules\GoalLists\GoalLists;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class DeleteGoalList extends ListsBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $params = $request->getParsedBody();
        $listId = $params['listId'] ?? null;
        if ($listId !== null) {
            $delete = $this->goalLists->deleteList((int)$listId);
            return AppResponse::create($response, ['delete' => $delete], $request->getAttribute('rid'));
        }
        return AppResponse::create($response, [], $request->getAttribute('rid'));
    }
}
