<?php

namespace App\Modules\Tasks;

use ZXC\Traits\Module;
use ZXC\Interfaces\IModule;

class Tasks implements IModule
{
    use Module;

    protected array $config = [];

    protected TasksStorage|null $storage = null;

    public function init(array $options = [])
    {
        $this->config = $options;
        $this->storage = new TasksStorage($this->config['fetchFields'] ?? []);
    }

    public function addTask(string $description, int $componentId, int $userId)
    {
        return $this->storage->addTask($description, $componentId, $userId);
    }

    public function fetchTasks(int $componentId)
    {
        return $this->storage->fetchTasks($componentId);
    }

    public function updateTask()
    {

    }
}
