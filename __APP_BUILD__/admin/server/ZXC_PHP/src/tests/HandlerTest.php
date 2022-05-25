<?php


use PHPUnit\Framework\TestCase;
use ZXC\Interfaces\Psr\Http\Message\ResponseInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;
use ZXC\Interfaces\Psr\Server\RequestHandlerInterface;
use ZXC\Native\Handler;
use ZXC\Native\PSR\Request;
use ZXC\Native\PSR\Response;
use ZXC\Native\PSR\ServerRequestFactory;


class HandlerTest extends TestCase
{
    public $request = null;

    public function __construct(?string $name = null, array $data = [], $dataName = '')
    {
        parent::__construct($name, $data, $dataName);

        $this->request = (new ServerRequestFactory())->createServerRequest('POST', '/uri');
    }

    public function testConstruct()
    {
        $this->expectException(InvalidArgumentException::class);
        new Handler(null);
    }

    public function testHandleOnlyRequest()
    {
        $wrapper = function (Request $request, $next = null) {
            return $this->handleTempOnlyRequest($request, $next);
        };
        $handler = new Handler($wrapper);
        $result = $handler->handle($this->request);
        $this->assertInstanceOf(Response::class, $result);
    }

    public function testHandleRequestAndNext()
    {
        $wrapper = function (Request $request, $next = null) {
            return $this->handleTempRequestAndNext($request, $next);
        };
        $next = function (Request $request, $next = null) {
            return $this->handleTempNext($request, $next);
        };
        $handler = new Handler($wrapper, $next);
        $result = $handler->handle($this->request);
        $this->assertInstanceOf(Response::class, $result);
    }

    public function testRequestHanlder()
    {
        $requestHandler = new class implements RequestHandlerInterface {
            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                return new Response();
            }
        };
        $handler = new Handler($requestHandler);
        $result = $handler->handle($this->request);
        $this->assertInstanceOf(Response::class, $result);
    }

    public function handleTempOnlyRequest(Request $request, $next = null)
    {
        if ($request instanceof Request && $next === null) {
            return new Response();
        }
        return null;
    }

    public function handleTempRequestAndNext(Request $request, $next = null)
    {
        if ($request instanceof Request && $next !== null) {
            return $next($request);
        }
        return null;
    }

    public function handleTempNext(Request $request, $next = null)
    {
        return new Response();
    }
}
