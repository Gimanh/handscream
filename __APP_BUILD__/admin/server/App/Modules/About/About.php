<?php

namespace App\Modules\About;

use App\Traits\AppDB;
use ZXC\Traits\Module;
use ZXC\Interfaces\IModule;

class About implements IModule
{
    use Module, AppDB;

    protected ?AboutStorage $storage;

    public function init(array $options = [])
    {
        $this->initDatabase();
        $this->storage = new AboutStorage($this->db);
    }

    public function fetchVersionsInfo(): array
    {
        return $this->storage->fetchVersionsInfo();
    }
}
