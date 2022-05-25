<?php


namespace ZXC\Native;


use RuntimeException;


class ModuleParams
{
    private $defer;

    private $class;

    private $options;

    public function __construct(string $class, array $options = [], bool $defer = true)
    {
        $this->class = $class;

        if (!$this->class) {
            throw new RuntimeException("Property class for module is not defined.");
        }
        $this->options = $options;

        $this->defer = $defer;
    }

    public function isDefer(): bool
    {
        return $this->defer;
    }

    public function getClass(): string
    {
        return $this->class;
    }

    public function getOptions(): array
    {
        return $this->options;
    }
}
