<?php

namespace App\Modules\GoalComponents\Handlers;

use App\AppResponse;
use ZXC\Native\Modules;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use App\Modules\GoalComponents\GoalComponents;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class FetchAllGoalComponents
{
    protected GoalComponents|null $goalComponents = null;

    public function __construct()
    {
        $this->goalComponents = Modules::get('GoalComponents');
    }

    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $params = $routeParams->getParams();
        if (isset($params['goalId'])) {
            $components = $this->goalComponents->fetchAll((int)$params['goalId']);
            return AppResponse::create($response, $components ?? [], $request->getAttribute('rid'));
        }
        return AppResponse::create($response, [], $request->getAttribute('rid'));
    }
}
