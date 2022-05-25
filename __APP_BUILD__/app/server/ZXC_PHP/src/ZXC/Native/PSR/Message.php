<?php


namespace ZXC\Native\PSR;


use InvalidArgumentException;
use ZXC\Interfaces\Psr\Http\Message\MessageInterface;
use ZXC\Interfaces\Psr\Http\Message\StreamInterface;


class Message implements MessageInterface
{
    protected $headers = [];
    protected $headerNames = [];
    protected $protocolVersion = '1.1';

    protected static $validProtocolVersions = [
        '1.0' => true,
        '1.1' => true,
    ];
    /**
     * @var StreamInterface
     */
    protected $stream = null;

    protected function setHeaders(array $headers)
    {
        foreach ($headers as $name => $value) {
            $this->headerNames[strtolower($name)] = $name;
            if (!is_array($value)) {
                $value = [$value];
            }
            $headers[$name] = $value;
        }
        $this->headers = $headers;
    }

    /**
     * @param StreamInterface | resource | string $body
     * @param string $mode
     * @method setBody
     */
    protected function setBody($body, $mode='w+b')
    {
        if ($body instanceof Stream) {
            $this->stream = $body;
        } else {
            $this->stream = new Stream($body, $mode);
        }
    }

    public function getProtocolVersion()
    {
        return $this->protocolVersion;
    }

    public function withProtocolVersion($version)
    {
        if (!isset(self::$validProtocolVersions[$version])) {
            throw new InvalidArgumentException('Invalid HTTP version');
        }
        $new = clone $this;
        $new->protocolVersion = $version;
        return $new;
    }

    public function getHeaders()
    {
        return $this->headers;
    }

    public function hasHeader($name)
    {
        return isset($this->headerNames[strtolower($name)]);
    }

    public function getHeader($name)
    {
        if (!$this->hasHeader($name)) {
            return [];
        }
        $headerNameOrigin = $this->headerNames[strtolower($name)];
        return $this->headers[$headerNameOrigin];
    }

    public function getHeaderLine($name)
    {
        $header = $this->getHeader($name);
        return implode(',', $header);
    }

    public function withHeader($name, $value)
    {
        if (!is_string($value) && !is_array($value)) {
            throw new InvalidArgumentException('Header value can be string|string[]');
        }
        $new = clone $this;
        $lowerName = strtolower($name);
        if (isset($new->headerNames[$lowerName])) {
            unset($new->headers[$new->headerNames[$lowerName]]);
        }
        $new->headerNames[$lowerName] = $name;
        $new->headers[$name] = is_array($value) ? $value : [$value];
        return $new;
    }

    public function withAddedHeader($name, $value)
    {
        $new = clone $this;
        $lowerName = strtolower($name);
        if (!$new->hasHeader($name)) {
            $new->headerNames[$lowerName] = $name;
            $new->headers[$name] = is_array($value) ? $value : [$value];
        } else {
            $oldHeaders = $new->getHeader($name);
            $originName = $this->headerNames[$lowerName];
            $new->headers[$originName] = is_array($value) ? array_merge($value, $oldHeaders) : array_merge($oldHeaders, [$value]);
        }
        return $new;
    }

    public function withoutHeader($name)
    {
        $new = clone $this;
        if (!$this->hasHeader($name)) {
            return $new;
        }
        $lowerName = strtolower($name);
        $originName = $new->headerNames[$lowerName];
        unset($new->headers[$originName]);
        unset($new->headerNames[$lowerName]);
        return $new;
    }

    public function getBody()
    {
        return $this->stream;
    }

    public function withBody(StreamInterface $body)
    {
        $new = clone $this;

        $new->stream = $body;

        return $new;
    }
}
