<?php

namespace App;

use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;

class AppResponse
{
    public static function create(ResponseInterface $response, array $data = [], $rid = null): ResponseInterface
    {
        $response->getBody()->write(json_encode(['response' => $data, 'rid' => $rid]));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
