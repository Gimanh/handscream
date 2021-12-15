<?php

namespace App\Modules\Tasks\Handlers;

use App\AppResponse;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Native\RouteParams;

class TasksFetch
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        return AppResponse::create($response, [], $request->getAttribute('rid'));
    }
}
