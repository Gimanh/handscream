<?php

namespace App\Modules\Tags\Handlers;

use App\AppResponse;
use ZXC\Modules\Auth\User;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TagsFetch extends TagBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        /** @var $user User */
        $user = $request->getAttribute('user');
        $tags = $this->tags->fetchAll($user->getId()) ?? [];
        return AppResponse::create($response, $tags, $request->getAttribute('rid'), 200);
    }
}
