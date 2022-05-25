<?php

namespace App\Modules\AppLogger;

use ZXC\Interfaces\Psr\Log\LoggerInterface;

trait LoggerForClass
{
    protected ?LoggerInterface $logger;

    public function createLogger(string $moduleName = null)
    {
        if (!$moduleName) {
            $sections = explode('\\', get_class());
            $moduleName = end($sections);
        }
        $this->logger = new AppLogger($moduleName);
    }

    /**
     * @return LoggerInterface|null
     */
    public function getLogger(): ?LoggerInterface
    {
        return $this->logger;
    }
}
