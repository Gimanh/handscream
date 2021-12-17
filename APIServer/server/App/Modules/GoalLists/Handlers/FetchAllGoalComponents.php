<?php

namespace App\Modules\GoalLists\Handlers;

use App\AppResponse;
use ZXC\Native\Modules;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use App\Modules\GoalLists\GoalLists;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class FetchAllGoalComponents extends ListsBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $params = $routeParams->getParams();
        if (isset($params['goalId'])) {
            $components = $this->goalLists->fetchAll((int)$params['goalId']);
            return AppResponse::create($response, $components ?? [], $request->getAttribute('rid'));
        }
        return AppResponse::create($response, [], $request->getAttribute('rid'));
    }
}
