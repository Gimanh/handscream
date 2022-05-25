<?php


namespace ZXC\Native\PSR;


use ZXC\Interfaces\Psr\Http\Message\UriInterface;
use ZXC\Interfaces\Psr\Http\Message\RequestInterface;


/**
 * Class Request
 * @method
 * @package ZXC\Native\PSR
 */
class Request extends Message implements RequestInterface
{
    /**
     * @var string
     */
    protected $requestTarget;
    /**
     * @var UriInterface
     */
    protected $uri;
    /**
     * @var string
     */
    protected $method;

    /**
     * Request constructor.
     * @param string|UriInterface $uri
     * @param null $method
     * @param array $headers
     * @param string $body
     */
    public function __construct($uri = null, $method = null, $headers = [], $body = 'php://memory')
    {
        if ($uri instanceof UriInterface) {
            $this->uri = $uri;
        } else {
            $this->uri = new Uri($uri);
        }
        $this->method = strtoupper($method);
        $this->setBody($body);
        $this->setHeaders($headers);
    }

    public function getRequestTarget()
    {
        if ($this->requestTarget) {
            return $this->requestTarget;
        }

        if (!$this->uri) {
            return '/';
        }

        $target = $this->uri->getPath();

        if ($target == '') {
            return '/';
        }
        $query = $this->uri->getQuery();
        if ($query != '') {
            $target .= '?' . $query;
        }

        return $target;
    }

    public function withRequestTarget($requestTarget)
    {
        $new = clone $this;
        $new->requestTarget = $requestTarget;
        return $new;
    }

    public function getMethod()
    {
        return $this->method;
    }

    public function withMethod($method)
    {
        $new = clone $this;
        $new->method = $method;
        return $new;
    }

    public function getUri()
    {
        return $this->uri;
    }

    public function withUri(UriInterface $uri, $preserveHost = false)
    {
        if ($uri === $this->uri) {
            return $this;
        }
        $new = clone $this;
        $new->uri = $uri;
        if (!$preserveHost || !isset($this->headerNames['host'])) {
            $host = $new->uri->getHost();
            $port = $new->uri->getPort();
            if ($host != '') {
                if ($port !== null) {
                    $host .= ':' . $port;
                }
                if (isset($new->headerNames['host'])) {
                    $header = $new->headerNames['host'];
                } else {
                    $header = 'Host';
                    $new->headerNames['host'] = 'Host';
                }
                $new->headers = [$header => [$host]] + $new->headers;
            }
        }
        return $new;
    }
}
