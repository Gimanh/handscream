<?php

namespace App\Modules\Admins\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use App\Modules\Admins\BaseAdminsHandlers;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class AdminsCheckUsers extends BaseAdminsHandlers
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $exists = $this->admins->checkUserLoginOrEmail($routeParams->getParams()['login']);
        return AppResponse::create($response, ['exists' => $exists], $request->getAttribute('rid'));
    }
}
