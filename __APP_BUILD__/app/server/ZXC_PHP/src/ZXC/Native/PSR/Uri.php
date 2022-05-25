<?php


namespace ZXC\Native\PSR;


use InvalidArgumentException;
use ZXC\Interfaces\Psr\Http\Message\UriInterface;


class Uri implements UriInterface
{
    const HTTP = 'http';
    const HTTPS = 'https';
    /**
     * @var string
     */
    private $scheme;
    /**
     * @var string
     */
    private $userInfo = '';
    /**
     * @var string
     */
    private $host;
    /**
     * @var |null
     */
    private $port;
    /**
     * @var string
     */
    private $path;
    /**
     * @var string
     */
    private $query;
    /**
     * @var string
     */
    private $fragment;

    /**
     * Uri constructor.
     * @param string $uri
     */
    public function __construct($uri = '')
    {
        if ($uri != '') {
            $parts = parse_url($uri);
            if (!$parts) {
                throw new InvalidArgumentException('Invalid URI ' . $uri);
            }
            $this->scheme = isset($parts['scheme']) ? $parts['scheme'] : '';
            $this->userInfo = isset($parts['user']) ? $parts['user'] : '';
            $this->host = isset($parts['host']) ? strtolower($parts['host']) : '';
            $this->port = isset($parts['port']) ? $parts['port'] : null;
            $this->path = isset($parts['path']) ? $parts['path'] : '';
            $this->query = isset($parts['query']) ? $parts['query'] : '';
            $this->fragment = isset($parts['fragment']) ? $parts['fragment'] : '';
            if (isset($parts['pass'])) {
                $this->userInfo .= ':' . $parts['pass'];
            }
        }
    }

    public function getScheme()
    {
        return strtolower($this->scheme);
    }

    public function getAuthority()
    {
        $authority = strtolower($this->host);
        if ($this->userInfo !== '') {
            $authority = $this->userInfo . '@' . $authority;
        }

        if ($this->port !== null) {
            $authority .= ':' . $this->port;
        }

        return $authority;
    }

    public function getUserInfo()
    {
        return $this->userInfo;
    }

    public function getHost()
    {
        return strtolower($this->host);
    }

    public function getPort()
    {
        return $this->port;
    }

    public function getPath()
    {
        return $this->path;
    }

    public function getQuery()
    {
        return $this->query;
    }


    public function getFragment()
    {
        return $this->fragment;
    }

    public function withScheme($scheme)
    {
        $new = clone $this;
        $new->scheme = strtolower($scheme);
        return $new;
    }

    public function withUserInfo($user, $password = null)
    {
        $new = clone $this;
        if ($user) {
            $new->userInfo = $user . ':' . $password;
        } else {
            $new->userInfo = '';
        }

        return $new;
    }

    public function withHost($host)
    {
        $new = clone $this;
        $new->host = strtolower($host);
        return $new;
    }

    public function withPort($port)
    {
        $new = clone $this;
        $new->port = $port;
        return $new;
    }

    public function withPath($path)
    {
        $new = clone $this;
        $new->path = $path;
        return $new;
    }

    public function withQuery($query)
    {
        $new = clone $this;
        $new->query = $query;
        return $new;
    }

    public function withFragment($fragment)
    {
        $new = clone $this;
        $new->fragment = $fragment;
        return $new;
    }

    public function __toString()
    {
        $uri = '';
        $authority = $this->getAuthority();
        if ($this->scheme != '') {
            $uri .= strtolower($this->scheme) . ':';
        }
        if ($authority != '' || $this->scheme === 'file') {
            $uri .= '//' . $authority;
        }
        $uri .= $this->path;
        if ($this->query != '') {
            $uri .= '?' . $this->query;
        }
        if ($this->fragment != '') {
            $uri .= '#' . $this->fragment;
        }
        return $uri;
    }
}
