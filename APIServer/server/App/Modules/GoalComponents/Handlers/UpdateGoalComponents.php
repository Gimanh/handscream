<?php

namespace App\Modules\GoalComponents\Handlers;

use App\AppResponse;
use ZXC\Native\Modules;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use App\Modules\GoalComponents\GoalComponents;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class UpdateGoalComponents
{
    protected GoalComponents|null $goalComponents = null;

    public function __construct()
    {
        $this->goalComponents = Modules::get('GoalComponents');
    }

    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $params = $request->getParsedBody();
        if (isset($params['id']) && isset($params['name'])) {
            $component = $this->goalComponents->updateComponent((int)$params['id'], $params['name']);
            return AppResponse::create($response, ['update' => !!$component, 'component' => $component], $request->getAttribute('rid'));
        }
        return AppResponse::create($response, [], $request->getAttribute('rid'));
    }
}
