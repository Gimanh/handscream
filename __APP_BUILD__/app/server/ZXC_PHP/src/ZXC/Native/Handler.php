<?php


namespace ZXC\Native;


use InvalidArgumentException;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;


class Handler implements RequestHandlerInterface
{
    /** @var RequestHandlerInterface | callable */
    protected $handlerCaller;

    /**  @var Handler|null */
    protected $nextHandler;

    /** @var string */
    protected $middlewareName = '';

    public function __construct($handlerCaller, $nextMiddleware = null, $middlewareName = '')
    {
        if (!$handlerCaller) {
            throw new InvalidArgumentException(
                'Argument handler caller is not defined.'
            );
        }
        $this->handlerCaller = $handlerCaller;
        $this->nextHandler = $nextMiddleware;
        $this->middlewareName = $middlewareName;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        if ($this->handlerCaller instanceof RequestHandlerInterface) {
            return $this->handlerCaller->handle($request);
        } else {
            return ($this->handlerCaller)($request, $this->nextHandler);
        }
    }
}
