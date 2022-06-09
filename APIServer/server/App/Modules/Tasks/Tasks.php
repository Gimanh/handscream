<?php

namespace App\Modules\Tasks;

use App\Modules\Tasks\Args\FetchTasksArg;
use ZXC\Traits\Module;
use ZXC\Native\Modules;
use ZXC\Modules\Auth\User;
use ZXC\Modules\Auth\Auth;
use ZXC\Interfaces\IModule;
use App\Modules\AppLogger\LoggerForClass;

class Tasks implements IModule
{
    use Module, LoggerForClass;

    protected array $config = [];

    protected ?Auth $auth = null;

    protected ?TasksStorage $storage = null;

    protected ?User $user = null;

    protected int $tasksLimit = 50;

    public function init(array $options = [])
    {
        $this->config = $options;
        $this->auth = Modules::get('auth');
        $this->user = $this->auth->getUser();
        $this->tasksLimit = $this->config['tasksLimit'] ?? 50;
        $this->storage = new TasksStorage($this->user, $this->tasksLimit ?? null);
        $this->createLogger();
    }

    public function addTask(string $description, int $componentId, int $creatorId, int $parentId = null)
    {
        return $this->storage->addTask($description, $componentId, $creatorId, $parentId);
    }

    /**
     * @param int $componentId
     * @return array<int, TaskItem>
     */
    public function fetchTasks(FetchTasksArg $fetchTasksArg): array
    {
        return $this->storage->fetchTasks($fetchTasksArg);
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

    public function moveTask(int $taskId, int $goalListId): bool
    {
        return $this->storage->moveTask($taskId, $goalListId);
    }

    public function fetchAppPriorities(): array
    {
        return $this->storage->fetchAppPriorities();
    }

    public function updatePriority(int $taskId, int $priorityId): bool
    {
        return $this->storage->updatePriority($taskId, $priorityId);
    }

    /**
     * @return User|null
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    public function getTasksLimit()
    {
        return $this->tasksLimit;
    }

    public function fetchHistory(int $taskId): array
    {
        $history = $this->storage->fetchTaskHistory($taskId);
        foreach ($history as $task) {
            $listData = $this->storage->fetchListName($task->goalListId);
            if ($task->parentId) {
                $taskNameData = $this->storage->fetchTaskById($task->parentId);
                if ($taskNameData) {
                    $task->parentIdDescription = $taskNameData[0]->description;
                }
            }
            if ($listData) {
                $task->goalListIdDescription = $listData[0]['name'];
                $task->canNotRecovery = false;
            } else {
                $task->canNotRecovery = true;
            }
            $task->completeDescription = $task->complete ? '[ + ]' : '[ - ]';
        }
        return $history;
    }

    public function recoveryTaskHistory(int $id): bool
    {
        $historyItem = $this->storage->fetchTaskHistoryById($id);
        if ($historyItem) {
            $task = json_decode($historyItem['task'], true);
            return $this->storage->updateTaskState($task);
        }
        return false;
    }
}
