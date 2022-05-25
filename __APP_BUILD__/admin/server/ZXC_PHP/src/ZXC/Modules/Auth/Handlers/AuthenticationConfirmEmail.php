<?php

namespace ZXC\Modules\Auth\Handlers;

use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Modules\Auth\Data\ConfirmEmailData;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Modules\Auth\Exceptions\InvalidConfirmEmailArgs;

class AuthenticationConfirmEmail extends BaseAuthHandler
{
    /**
     * @throws InvalidConfirmEmailArgs
     */
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        list('login' => $login, 'code' => $code) = $routeParams->getParams();
        $this->auth->confirmEmail(new ConfirmEmailData($login, $code));
        return $response->withHeader('Location', '/')->withStatus(302);
    }
}
