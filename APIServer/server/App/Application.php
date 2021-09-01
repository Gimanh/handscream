<?php

namespace App;


use ZXC\Native\RouteParams;
use ZXC\Native\PSR\Response;
use ZXC\Native\PSR\ServerRequest;


class Application
{
    public function hello(ServerRequest $request, Response $response, RouteParams $routeParams)
    {
        $response->write('Hello--0-0-0-0-0-0');
        return $response;
    }

    public function helloUser(ServerRequest $request, Response $response, RouteParams $routeParams)
    {
        $userName = json_encode($routeParams->getParams());
        $response->write('Hello user ' . ($userName) . '');
        return $response;
    }

    public function helloStatic(ServerRequest $request, Response $response, RouteParams $routeParams)
    {
        $userName = json_encode($routeParams->getParams());
        $response->write('Hello static method for ' . ($userName) . ' ');
        return $response;
    }

    public function profile(ServerRequest $request, Response $response, RouteParams $routeParams)
    {
        $json = json_encode($routeParams->getParams());
        $response->write('Called profile method ' . $json);
        return $response;
    }
}
