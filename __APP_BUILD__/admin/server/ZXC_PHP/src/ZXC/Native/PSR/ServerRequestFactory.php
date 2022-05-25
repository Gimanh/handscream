<?php


namespace ZXC\Native\PSR;


use ZXC\Native\FromGlobals;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestFactoryInterface;


class ServerRequestFactory implements ServerRequestFactoryInterface
{

    public function createServerRequest(string $method, $uri, array $serverParams = []): ServerRequestInterface
    {
        $get = FromGlobals::getGet();
        $post = FromGlobals::getPost();
        $files = FromGlobals::getFiles();
        $cookie = FromGlobals::getCookie();

        if (!$serverParams) {
            $server = FromGlobals::getServerParams();
        }else{
            $server = $serverParams;
        }

        if (!$uri) {
            $uri = FromGlobals::getUri();
        }

        if (!$method) {
            $method = FromGlobals::getMethod();
        }

        return new ServerRequest($method, $uri, $server, $cookie, $files, $get, $post);
    }
}
