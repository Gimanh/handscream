<?php

namespace ZXC\Modules\Cors;

use ZXC\Interfaces\IModule;
use ZXC\Traits\Module;

class Cors implements IModule
{
    use Module;

    /**
     * @var string
     */
    protected $origin = '';

    /**
     * @var bool
     */
    protected $credentials = false;

    /**
     * @var int
     */
    protected $maxAge = 0;

    /**
     * @var string[]
     */
    protected $headers = [];

    /**
     * @var string[]
     */
    protected $methods = [];

    protected $exposeHeaders = [];

    public function init(array $options = [])
    {
        $this->origin = $options['origin'] ?? '';
        $this->credentials = $options['credentials'] ?? false;
        $this->maxAge = $options['maxAge'] ?? 0;
        $this->headers = $options['headers'] ?? [];
        $this->methods = $options['methods'] ?? [];
        $this->exposeHeaders = $options['expose'] ?? [];
    }

    public function getResponseHeaders(): array
    {
        if ($this->origin === '*') {
            $this->origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
        }

        return [
            'Access-Control-Allow-Origin' => $this->origin,
            'Access-Control-Allow-Credentials' => $this->credentials,
            'Access-Control-Max-Age' => $this->maxAge,
            'Access-Control-Allow-Methods' => implode(',', $this->methods),
            'Access-Control-Allow-Headers' => implode(',', $this->headers)
        ];
    }

    /**
     * @return string
     */
    public function getOrigin(): string
    {
        return $this->origin;
    }

    /**
     * @return bool
     */
    public function isCredentials(): bool
    {
        return $this->credentials;
    }

    /**
     * @return int
     */
    public function getMaxAge(): int
    {
        return $this->maxAge;
    }

    /**
     * @return string[]
     */
    public function getHeaders(): array
    {
        return $this->headers;
    }

    /**
     * @return string[]
     */
    public function getMethods(): array
    {
        return $this->methods;
    }

    /**
     * @return string
     */
    public function getExposeHeaders(): array
    {
        return $this->exposeHeaders;
    }
}
