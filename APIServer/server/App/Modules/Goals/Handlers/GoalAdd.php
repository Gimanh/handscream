<?php

namespace App\Modules\Goals\Handlers;

use App\AppResponse;
use ZXC\Modules\Auth\User;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class GoalAdd extends GoalBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $parsedBody = $request->getParsedBody();
        $name = $parsedBody['name'] ?? '';
        $description = $parsedBody['description'] ?? null;
        /** @var $user User */
        $user = $request->getAttribute('user');
        $goal = false;
        if ($name) {
            $goal = $this->goals->addGoal($name, $description, $user->getId());
        }
        return AppResponse::create($response, ['add' => !!$goal, 'goal' => $goal], $request->getAttribute('rid'), 200);
    }
}