<?php

namespace App\Modules\Tasks\Middlewares;

use ZXC\Native\PSR\Response;
use App\Modules\Tasks\TaskPermissions;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;

class CanAccessTaskHistory extends BaseTaskMiddleware
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        //FIXME add permission and check it here
        return $handler->handle($request);
    }
}
