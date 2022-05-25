<?php

namespace ZXC\Modules\Auth\Handlers;

use ZXC\Modules\Auth\Data\LoginData;
use ZXC\Modules\Auth\Data\RegisterData;
use ZXC\Modules\Auth\Exceptions\InvalidEmail;
use ZXC\Modules\Auth\Exceptions\InvalidLogin;
use ZXC\Modules\Auth\Exceptions\InvalidPassword;
use ZXC\Modules\Auth\Exceptions\PasswordMismatch;
use ZXC\Native\Modules;
use ZXC\Modules\Auth\Auth;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\Response;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Modules\Auth\Exceptions\AuthModuleNotFound;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class AuthenticationRegistration
{
    /**
     * @var null | Auth
     */
    protected $auth = null;

    /**
     * @throws AuthModuleNotFound
     */
    public function __construct()
    {
        $this->auth = Modules::get('auth');
        if (!$this->auth) {
            throw new AuthModuleNotFound();
        }
    }

    public function __invoke(ServerRequest $request, Response $response, RouteParams $routeParams): ResponseInterface
    {
        $registerData = $this->getRegistrationData($request);
        if (!$registerData) {
            return $response->withStatus(400);
        }
        $loginResult = $this->auth->register($registerData);
        $response->getBody()->write(json_encode($loginResult));
        return $response;
    }

    /**
     * @param ServerRequest $request
     * @return false|RegisterData
     * @throws InvalidLogin
     * @throws InvalidEmail
     * @throws InvalidPassword
     * @throws PasswordMismatch
     */
    public function getRegistrationData(ServerRequest $request)
    {
        $body = $request->getParsedBody();
        $block = $this->auth->isBlockWithoutEmailConfirm() ? 1 : 0;
        return new RegisterData($body['login'], $body['email'], $body['password'], $body['passwordRepeat'], $block);
    }
}
