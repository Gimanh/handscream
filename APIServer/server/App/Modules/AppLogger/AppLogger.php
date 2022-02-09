<?php

namespace App\Modules\AppLogger;

use ZXC\Native\Config;
use ZXC\Modules\Logger\Logger;
use ZXC\Interfaces\Psr\Log\LoggerInterface;

class AppLogger extends Logger
{
    protected string $moduleName;

    protected ?LoggerInterface $logger;

    public function __construct($moduleName)
    {
        $this->moduleName = $moduleName;
        $baseOptions = Config::get('modules/Logger/options');
        if ($baseOptions) {
            $baseOptions['fileName'] = $this->moduleName . '_';
            $this->init($baseOptions);
        }
    }

}
