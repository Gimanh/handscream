<?php

namespace App\Modules\AppConfig;

use ZXC\Interfaces\IModule;
use ZXC\Traits\Module;

class AppConfig implements IModule
{
    use Module;

    protected $config = [];

    public function init(array $options = [])
    {
        $this->config = $options;
        if (!isset($this->config['public'])) {
            $this->config['public'] = [];
        }
        if (!isset($this->config['private'])) {
            $this->config['private'] = [];
        }
    }

    public function getPublicConfig()
    {
        return $this->config['public'] ?? [];
    }
}
