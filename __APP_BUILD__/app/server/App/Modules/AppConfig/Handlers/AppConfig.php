<?php

namespace App\Modules\AppConfig\Handlers;

use App\AppResponse;
use ZXC\Native\Modules;
use ZXC\Native\PSR\ResponseFactory;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class AppConfig implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        /** @var \App\Modules\AppConfig\AppConfig $appConfig */
        $appConfig = Modules::get('appconfig');
        $response = (new ResponseFactory())->createResponse();
        return AppResponse::create($response, $appConfig->getPublicConfig(), $request->getAttribute('rid'));
    }
}
