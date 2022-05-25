<?php

namespace App\Modules\Goals\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class GoalDelete extends GoalBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $parsedBody = $request->getParsedBody();
        $id = $parsedBody['goalId'] ?? null;
        if ($id === null) {
            return AppResponse::create($response, ['delete' => false], $request->getAttribute('rid'), 200);
        }
        return AppResponse::create($response, ['delete' => $this->goals->deleteGoal((int)$id),], $request->getAttribute('rid'), 200);
    }
}
