<?php


namespace ZXC\Native;


class RouteParams
{
    private $params;

    public function __construct(array $params = [])
    {
        $this->params = $params;
    }

    public function __get($name)
    {
        return $this->params[$name] ?? null;
    }

    /**
     * @return array
     */
    public function getParams(): array
    {
        return $this->params;
    }
}
