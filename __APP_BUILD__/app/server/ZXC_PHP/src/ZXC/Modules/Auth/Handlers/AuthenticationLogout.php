<?php

namespace ZXC\Modules\Auth\Handlers;

use ZXC\Native\RouteParams;
use ZXC\Native\PSR\Response;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class AuthenticationLogout extends BaseAuthHandler
{
    public function __invoke(ServerRequest $request, Response $response, RouteParams $routeParams): ResponseInterface
    {
        $user = $request->getAttribute('user');
        $result = false;
        if ($user) {
            $result = $this->auth->logout($request);
        }
        return $response->write(json_encode(['logout' => $result]))
            ->withHeader('Content-Type', 'application/json');
    }
}
