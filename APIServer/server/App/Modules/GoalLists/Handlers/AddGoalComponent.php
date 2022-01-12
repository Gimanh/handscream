<?php

namespace App\Modules\GoalLists\Handlers;

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
            /** @var User $user */
            $user = $request->getAttribute('user');
            $component = $this->goalLists->addComponent($parsedBody['name'], (int)$parsedBody['goalId'], (int)$user->getId());
            return AppResponse::create($response, ['add' => !!$component, 'component' => $component], $request->getAttribute('rid'));
        }
        return AppResponse::create($response, ['add' => false], $request->getAttribute('rid'));
    }
}
