<?php

namespace ZXC\Modules\Auth\Handlers;

use ZXC\Native\RouteParams;
use ZXC\Native\PSR\Response;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Modules\Auth\Data\ChangeRemindedPasswordData;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Modules\Auth\Exceptions\InvalidChangeRemindedPasswordArgs;

class AuthenticationResetPassword extends BaseAuthHandler
{
    /**
     * @throws InvalidChangeRemindedPasswordArgs
     */
    public function __invoke(ServerRequest $request, Response $response, RouteParams $routeParams): ResponseInterface
    {
        $body = $request->getParsedBody();
        $result = $this->auth->changeRemindedPassword(new ChangeRemindedPasswordData($body['login'], $body['code'], $body['password'], $body['passwordRepeat']));
        return $response->write(json_encode(['reset' => $result]));
    }
}
