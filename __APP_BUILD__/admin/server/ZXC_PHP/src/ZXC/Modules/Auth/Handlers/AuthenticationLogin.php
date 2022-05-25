<?php

namespace ZXC\Modules\Auth\Handlers;

use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Modules\Auth\Data\LoginData;
use ZXC\Modules\Auth\Exceptions\InvalidLogin;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class AuthenticationLogin extends BaseAuthHandler
{
    /**
     * @throws InvalidLogin
     */
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $loginData = $this->getLoginData($request);
        if (!$loginData) {
            return $response->withStatus(400);
        }
        $loginResult = $this->auth->login($loginData);
        if ($loginResult) {
            $response->getBody()->write(json_encode($loginResult));
            return $response;
        }
        return $response->withStatus(403);
    }

    /**
     * @throws InvalidLogin
     */
    public function getLoginData(ServerRequest $request): LoginData|false
    {
        $body = $request->getParsedBody();
        if (!isset($body['login']) || !isset($body['password'])) {
            return false;
        }

        return new LoginData($body['login'], $body['password']);
    }
}
