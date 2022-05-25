<?php

namespace ZXC\Modules\Cors\Middlewares;

use ZXC\Native\Modules;
use ZXC\Native\PSR\Response;
use ZXC\Native\PSR\ResponseFactory;
use ZXC\Native\Router;
use ZXC\Interfaces\Psr\Server\MiddlewareInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class Cors implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if ($request->getMethod() === Router::METHOD_OPTIONS) {
            $response = (new ResponseFactory())->createResponse(200);
            return $this->prepareResponse($response);
        }
        $response = $handler->handle($request);
        return $this->prepareResponse($response);
    }

    protected function prepareResponse(ResponseInterface $response): ResponseInterface
    {
        /** @var $cors \ZXC\Modules\Cors\Cors */
        $cors = Modules::get('cors');

        if ($cors->getExposeHeaders()) {
            $response = $response
                ->withHeader('Access-Control-Expose-Headers', implode(',', $cors->getExposeHeaders()));
        }

        return $response
            ->withHeader('Access-Control-Max-Age', (string)$cors->getMaxAge())
            ->withHeader('Access-Control-Allow-Origin', $cors->getOrigin())
            ->withHeader('Access-Control-Allow-Headers', implode(',', $cors->getHeaders()))
            ->withHeader('Access-Control-Allow-Methods', implode(',', $cors->getMethods()))
            ->withHeader('Access-Control-Allow-Credentials', $cors->isCredentials() ? 'true' : 'false');
    }
}
