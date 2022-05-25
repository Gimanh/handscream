<?php

namespace App\Modules\Goals\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class GoalUpdate extends GoalBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $parsedBody = $request->getParsedBody();
        $id = $parsedBody['id'] ?? null;
        if ($id === null) {
            return AppResponse::create($response, ['update' => false], $request->getAttribute('rid'), 200);
        }
        $name = trim($parsedBody['name']) ?? '';
        $description = $parsedBody['description'] ?? null;
        if ($name) {
            $goal = $this->goals->updateGoal((int)$id, (string)$name, (string)$description);
            return AppResponse::create($response, ['update' => !!$goal, 'goal' => $goal[0]], $request->getAttribute('rid'), 200);
        }
        return AppResponse::create($response, ['update' => false], $request->getAttribute('rid'), 200);
    }
}
