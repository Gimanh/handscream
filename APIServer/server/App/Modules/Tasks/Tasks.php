<?php

namespace App\Modules\Tasks;

use ZXC\Modules\Auth\User;
use ZXC\Native\Modules;
use ZXC\Traits\Module;
use ZXC\Modules\Auth\Auth;
use ZXC\Interfaces\IModule;

class Tasks implements IModule
{
    use Module;

    protected array $config = [];

    protected ?Auth $auth = null;

    protected ?TasksStorage $storage = null;

    protected ?User $user = null;

    public function init(array $options = [])
    {
        $this->config = $options;
        $this->auth = Modules::get('auth');
        $this->user = $this->auth->getUser();
        $this->storage = new TasksStorage($this->user);
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

    public function updateTaskDescription(int $taskId, string $description): TaskItem|false
    {
        return $this->storage->updateTaskDescription($taskId, $description);
    }

    public function updateTaskComplete(int $taskId, bool $complete): TaskItem|false
    {
        return $this->storage->updateTaskComplete($taskId, $complete);
    }

    public function deleteTask(int $taskId): bool
    {
        return $this->storage->deleteTask($taskId);
    }

    public function fetchUserInfo(int $userId): array
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

    public function getDetailedTask(int $taskId): TaskItem
    {
        $tasks = $this->storage->fetchTaskById($taskId);
        $task = $tasks[0];
        if ($task->responsibleId) {
            $task->setResponsibleUser($this->fetchUserInfo($task->responsibleId));
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

    /**
     * @param int $taskId
     * @return array<int, TaskItem>
     */
    public function fetchSubtasks(int $taskId): array
    {
        return $this->storage->fetchSubtasks($taskId);
    }
}
