<?php

namespace App\Modules\Auth\Handlers;

use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Modules\Auth\Data\ConfirmEmailData;
use ZXC\Modules\Auth\Exceptions\InvalidConfirmEmailArgs;
use ZXC\Modules\Auth\Handlers\AuthenticationConfirmEmail;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Native\RouteParams;

class AppAuthenticationConfirmEmail extends AuthenticationConfirmEmail
{
    /**
     * @throws InvalidConfirmEmailArgs
     */
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        list('login' => $login, 'code' => $code) = $routeParams->getParams();
        $result = $this->auth->confirmEmail(new ConfirmEmailData($login, $code));
        $redirect = $this->auth->getRedirectAfterConfirm();
        $dir = __DIR__;
        $html = file_get_contents($dir . '/../assets/email-confirmation.html');
        $message = $result ? 'Successful email confirmation!' : 'Failed email confirmation!';
        $html = str_replace(['{$status}', '{$redirect}', '{$message}'], [(int)$result, $redirect, $message], $html);
        $response->getBody()->write($html);
        return $response->withStatus(302);
    }
}
