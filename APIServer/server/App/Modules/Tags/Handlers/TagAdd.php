<?php

namespace App\Modules\Tags\Handlers;

use App\AppResponse;
use ZXC\Native\RouteParams;
use ZXC\Native\PSR\ServerRequest;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class TagAdd extends TagBaseHandler
{
    public function __invoke(ServerRequest $request, ResponseInterface $response, RouteParams $routeParams): ResponseInterface
    {
        $data = $request->getParsedBody();
        $tag = $this->tags->addTag($data['name'], strtoupper($data['color']));
        return AppResponse::create($response, ['tag' => $tag], $request->getAttribute('rid'), 200);
    }
}
