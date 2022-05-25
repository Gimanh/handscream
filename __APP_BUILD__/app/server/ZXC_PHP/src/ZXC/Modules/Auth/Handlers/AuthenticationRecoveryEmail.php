<?php

namespace ZXC\Modules\Auth\Handlers;

use ZXC\Native\RouteParams;
use ZXC\Native\PSR\Response;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Modules\Auth\Data\RemindPasswordData;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Modules\Auth\Exceptions\InvalidRemindPasswordArgs;

class AuthenticationRecoveryEmail extends BaseAuthHandler
{
    /**
     * @throws InvalidRemindPasswordArgs
     */
    public function __invoke(ServerRequest $request, Response $response, RouteParams $routeParams): ResponseInterface
    {
        $body = $request->getParsedBody();
        $result = false;
        if (isset($body['email'])) {
            $result = $this->auth->remindPassword(new RemindPasswordData($body['email']));
        }
        return $response->write(json_encode(['sent' => $result]));
    }
}
