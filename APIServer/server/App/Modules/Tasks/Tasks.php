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

    public function updateTaskDescription(int $taskId, string $description): array|false
    {
        return $this->storage->updateTaskDescription($taskId, $description);
    }

    public function updateTaskComplete(int $taskId, bool $complete): array|false
    {
        return $this->storage->updateTaskComplete($taskId, $complete);
    }

    public function deleteTask(int $taskId): bool
    {
        return $this->storage->deleteTask($taskId);
    }
}
