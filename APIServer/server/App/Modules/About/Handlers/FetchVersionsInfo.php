<?php

namespace App\Modules\About\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class FetchVersionsInfo extends BaseAbout
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        return AppResponse::create($response, $this->about->fetchVersionsInfo(), $request->getAttribute('rid'));
    }
}
