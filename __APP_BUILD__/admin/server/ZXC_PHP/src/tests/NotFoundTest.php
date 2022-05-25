<?php


use PHPUnit\Framework\TestCase;
use ZXC\Native\NotFound;
use ZXC\Native\PSR\Response;
use ZXC\Native\PSR\ServerRequestFactory;

class NotFoundTest extends TestCase
{
    public function testNotFound()
    {
        $notFound = new NotFound();
        $response = $notFound->notFound((new ServerRequestFactory())->createServerRequest('POST', '/uri'));
        $this->assertInstanceOf(Response::class, $response);
        $this->assertSame(404, $response->getStatusCode());
    }
}
