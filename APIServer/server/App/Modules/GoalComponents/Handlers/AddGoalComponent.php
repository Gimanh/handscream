<?php

namespace App\Modules\GoalComponents\Handlers;

use App\AppResponse;
use ZXC\Native\Modules;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use App\Modules\GoalComponents\GoalComponents;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class AddGoalComponent
{
    protected GoalComponents|null $goalComponents = null;

    public function __construct()
    {
        $this->goalComponents = Modules::get('GoalComponents');
    }

    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $parsedBody = $request->getParsedBody();
        if (isset($parsedBody['name']) && isset($parsedBody['goalId'])) {
            $component = $this->goalComponents->addComponent($parsedBody['name'], $parsedBody['goalId']);
            return AppResponse::create($response, ['add' => !!$component, 'component' => $component], $request->getAttribute('rid'));
        }
        return AppResponse::create($response, ['add' => false], $request->getAttribute('rid'));
    }
}
