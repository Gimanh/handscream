<?php


namespace ZXC\Interfaces\Psr\Http\Message;


use InvalidArgumentException;
use ZXC\Interfaces\Psr\Http\Message\UriInterface;


interface UriFactoryInterface
{
    /**
     * Create a new URI.
     *
     * @param string $uri The URI to parse.
     *
     * @return UriInterface
     * @throws InvalidArgumentException If the given URI cannot be parsed.
     */
    public function createUri(string $uri = '') : UriInterface;
}
