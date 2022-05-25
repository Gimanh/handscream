<?php


use PHPUnit\Framework\TestCase;
use ZXC\Native\FromGlobals;

class FromGlobalsTest extends TestCase
{
    public function setUp(): void
    {
        $mockParams = [
            'HTTP_HOST' => 'zxcphp.local',
            'REQUEST_URI' => '/user/profile',
            'REQUEST_METHOD' => 'POST',
            'REMOTE_ADDR' => 'remote'
        ];
        $_SERVER = array_merge($mockParams, $_SERVER);
        $_POST = ['prop' => 123];
        $_GET = ['prop' => '123'];
        $_COOKIE = ['p' => 'val'];
        $_FILES = [];
    }

    public function testGetUri()
    {
        $uri = FromGlobals::getUri();
        $uri = (string)$uri;
        $this->assertSame('http://zxcphp.local/user/profile', $uri);
    }

    public function testGetMethod()
    {
        $this->assertSame('POST', FromGlobals::getMethod());
    }

    public function testGetServerParams()
    {
        $this->assertSame($_SERVER, FromGlobals::getServerParams());
    }

    public function testGetPost()
    {
        $this->assertSame(['prop' => 123], FromGlobals::getPost());
    }

    public function testGetGet()
    {
        $this->assertSame(['prop' => '123'], FromGlobals::getGet());
    }

    public function testGetIp()
    {
        $this->assertSame('remote', FromGlobals::getIp());
    }

    public function testGetCookie()
    {
        $this->assertSame(['p' => 'val'], FromGlobals::getCookie());
    }

    public function testGetFiles()
    {
        $this->assertSame([], FromGlobals::getFiles());
    }
}
