<?php

namespace App\Modules\GoalComponents\Handlers;

use App\AppResponse;
use ZXC\Native\Modules;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use App\Modules\GoalComponents\GoalComponents;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class FetchAllGoalComponents extends ListsBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        if (isset($request->getQueryParams()['goalId'])) {
            $components = $this->goalLists->fetchAll((int)$request->getQueryParams()['goalId']);
            return AppResponse::create($response, $components ?? [], $request->getAttribute('rid'));
        }
        return AppResponse::create($response, [], $request->getAttribute('rid'));
    }
}
