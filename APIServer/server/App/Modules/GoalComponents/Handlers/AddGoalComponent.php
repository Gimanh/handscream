<?php

namespace App\Modules\GoalComponents\Handlers;

use App\AppResponse;
use ZXC\Modules\Auth\User;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class AddGoalComponent extends ListsBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $parsedBody = $request->getParsedBody();
        if (isset($parsedBody['name']) && isset($parsedBody['goalId'])) {
            $component = $this->goalLists->addComponent($parsedBody['name'], (int)$parsedBody['goalId']);
            return AppResponse::create($response, ['add' => !!$component, 'component' => $component], $request->getAttribute('rid'));
        }
        return AppResponse::create($response, ['add' => false], $request->getAttribute('rid'));
    }
}
