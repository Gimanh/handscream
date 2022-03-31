<?php

namespace App\Modules\Admins\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use App\Modules\Admins\BaseAdminsHandlers;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class AdminsDeleteUser extends BaseAdminsHandlers
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $delete = $this->admins->deleteUser((int)$request->getParsedBody()['id']);
        return AppResponse::create($response, [
            'delete' => $delete
        ], $request->getAttribute('rid'));
    }
}
