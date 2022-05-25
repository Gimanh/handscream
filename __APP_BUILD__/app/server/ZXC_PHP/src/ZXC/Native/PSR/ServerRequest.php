<?php

namespace ZXC\Native\PSR;


use ZXC\Interfaces\Psr\Http\Message\UriInterface;
use ZXC\Interfaces\Psr\Http\Message\UploadedFileInterface;
use ZXC\Interfaces\Psr\Http\Message\ServerRequestInterface;


class ServerRequest extends Request implements ServerRequestInterface
{
    /**
     * @var array
     */
    protected $serverParams = [];
    /**
     * @var array
     */
    protected $cookieParams = [];
    /**
     * @var array
     */
    protected $queryParams = [];
    /**
     * @var UploadedFileInterface[]
     */
    protected $uploadedFiles = [];
    /**
     * @var null|array|object
     */
    protected $parsedBody;
    /**
     * @var array
     */
    protected $attributes;

    /**
     * ServerRequest constructor.
     * @param string $method
     * @param string|UriInterface $uri
     * @param array $server
     * @param array $cookieParams
     * @param array $uploadedFiles
     * @param array $get
     * @param array $post
     */
    public function __construct(
        string $method,
        $uri,
        $server = [],
        $cookieParams = [],
        $uploadedFiles = [],
        $get = [],
        $post = []
    )
    {
        $this->serverParams = $server;
        $this->cookieParams = $cookieParams;
        //FIXME must be UploadedFileInterface[]
        $this->uploadedFiles = $uploadedFiles;
        if ($get) {
            $this->queryParams = $_GET;
        } else {
            if (isset($server['QUERY_STRING'])) {
                parse_str($server['QUERY_STRING'], $this->queryParams);
            }
        }

        if ($post) {
            $this->parsedBody = $post;
        }
        if (!$uri) {
            $uri = $this->getUriString();
        }
        if (!$method) {
            $method = $server['REQUEST_METHOD'] ?? '';
        }
        $headers = $this->getPsrServerHeaders();
        $body = 'php://memory';
        parent::__construct($uri, $method, $headers, $body);
    }

    public static function getPsrServerHeaders()
    {
        $psrHeaders = [];
        $allHeaders = self::getAllHeaders();
        foreach ($allHeaders as $name => $value) {
            if (!is_array($value)) {
                $value = [$value];
            }
            $psrHeaders[$name] = $value;
        }
        return $psrHeaders;
    }

    public static function getAllHeaders()
    {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }

    private function getUriString()
    {
        return (isset($this->serverParams['HTTPS']) && $this->serverParams['HTTPS'] === 'on' ? "https" : "http") . '://' . $this->serverParams['HTTP_HOST'] . $this->serverParams['REQUEST_URI'];
    }

    public function getServerParams()
    {
        return $this->serverParams;
    }

    public function getCookieParams()
    {
        return $this->cookieParams;
    }

    public function withCookieParams(array $cookies)
    {
        $new = clone $this;
        $new->cookieParams = $cookies;
        return $new;
    }

    public function getQueryParams()
    {
        return $this->queryParams;
    }

    public function withQueryParams(array $query)
    {
        $new = clone $this;
        $new->queryParams = $query;
        return $new;
    }

    public function getUploadedFiles()
    {
        return $this->uploadedFiles;
    }

    public function withUploadedFiles(array $uploadedFiles)
    {
        $new = clone $this;
        $new->uploadedFiles = $uploadedFiles;
        return $new;
    }

    public function getParsedBody()
    {
        return $this->parsedBody;
    }

    public function withParsedBody($data)
    {
        $new = clone $this;
        $new->parsedBody = $data;
        return $new;
    }

    public function getAttributes()
    {
        return $this->attributes;
    }

    public function getAttribute($name, $default = null)
    {
        if (isset($this->attributes[$name])) {
            return $this->attributes[$name];
        }
        return $default;
    }

    public function withAttribute($name, $value)
    {
        $new = clone $this;
        $new->attributes[$name] = $value;
        return $new;
    }

    public function withoutAttribute($name)
    {
        unset($this->attributes[$name]);
    }
}
