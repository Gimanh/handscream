<?php


namespace ZXC\Native\PSR;


use ZXC\Interfaces\Psr\Http\Message\StreamInterface;
use ZXC\Interfaces\Psr\Http\Message\StreamFactoryInterface;


class StreamFactory implements StreamFactoryInterface
{

    public function createStream(string $content = ''): StreamInterface
    {
        $stream = new Stream('php://temp', 'r+');
        $stream->write($content);
        return $stream;
    }

    public function createStreamFromFile(string $filename, string $mode = 'r'): StreamInterface
    {
        return new Stream($filename, $mode);
    }

    public function createStreamFromResource($resource): StreamInterface
    {
        new Stream($resource, 'r+');
    }
}
