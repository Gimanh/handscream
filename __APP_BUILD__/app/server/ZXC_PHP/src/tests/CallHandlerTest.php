<?php


use PHPUnit\Framework\TestCase;
use ZXC\Native\CallHandler;

class TestClassHandler
{
    public function __invoke($a)
    {
        return [123, $a];
    }

    public function someMethod($a, $b)
    {
        return [123, $a, $b];
    }
}

class CallHandlerTest extends TestCase
{
    public function testExecHandlerInvoke()
    {
        $result = CallHandler::execHandler('TestClassHandler', [[1, 2]]);
        $this->assertSame([123, [1, 2]], $result);
        $result = CallHandler::execHandler('TestClassHandler', [8,3]);
        $this->assertSame([123, 8], $result);
    }

    public function testExecHandlerSpecifiedMethod()
    {
        $result = CallHandler::execHandler('TestClassHandler:someMethod', [[1, 2], 'w']);
        $this->assertSame([123, [1, 2], 'w'], $result);
        $result = CallHandler::execHandler('TestClassHandler:someMethod', [8, 9]);
        $this->assertSame([123, 8, 9], $result);
    }

    public function testExecHandlerCallable()
    {
        $func = function($a, $b){
            return [123, $a, $b];
        };
        $result = CallHandler::execHandler($func, [[1, 2], 'w', 3]);
        $this->assertSame([123, [1, 2], 'w'], $result);
        $result = CallHandler::execHandler($func, [8, 9, 10]);
        $this->assertSame([123, 8, 9], $result);
    }
}
