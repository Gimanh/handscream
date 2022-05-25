<?php

namespace App\Modules\Admins\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use App\Modules\Admins\BaseAdminsHandlers;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class AdminsUpdateUser extends BaseAdminsHandlers
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        return AppResponse::create($response, [
            'update' => $this->admins->updateUser($request->getParsedBody())
        ], $request->getAttribute('rid'));
    }
}
