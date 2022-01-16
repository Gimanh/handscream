<?php

namespace App\Modules\Tasks;

use ZXC\Native\Modules;
use ZXC\Traits\Module;
use ZXC\Modules\Auth\Auth;
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

    public function addTask(string $description, int $componentId, int $userId, int $parentId = null)
    {
        return $this->storage->addTask($description, $componentId, $userId, $parentId);
    }

    /**
     * @param int $componentId
     * @return array<int, TaskItem>
     */
    public function fetchTasks(int $componentId): array
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

    public function fetchUserInfo(int $userId)
    {
        /** @var Auth $auth */
        $auth = Modules::get('auth');
        $userData = $auth->getStorageProvider()->fetchUserById($userId);
        return [
            'id' => $userData['id'],
            'login' => $userData['login'],
            'email' => $userData['email'],
        ];
    }

    public function getDetailedTask(int $taskId)
    {
        $task = $this->storage->fetchTaskById($taskId);
        if ($task['responsibleId']) {
            $task['responsibleUser'] = $this->fetchUserInfo($task['responsibleId']);
            unset($task['responsibleId']);
        }
        return $task;
    }

    public function updateTaskNote(int $taskId, string $note): bool
    {
        return $this->storage->updateTaskNote($taskId, $note);
    }

    public function updateTaskDeadline(int $taskId, string $deadline): bool
    {
        return $this->storage->updateTaskDeadline($taskId, $deadline);
    }

    public function fetchSubtasks(int $taskId): array
    {
        return $this->storage->fetchSubtasks($taskId);
    }
}
