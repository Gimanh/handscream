<?php

namespace App\Modules\Tasks;

use ZXC\Traits\Module;
use ZXC\Interfaces\IModule;

class Tasks implements IModule
{
    use Module;

    protected array $config = [];

    public function init(array $options = [])
    {
        $this->config = $options;
    }
}
