<?php

namespace App\Modules\Tasks;

use PDO;
use App\Traits\AppDB;
use ZXC\Modules\Auth\User;

class TasksStorage
{
    use AppDB;

    protected string $fetchFields = '*';

    protected ?User $user = null;

    public function __construct(?User $user = null)
    {
        $this->user = $user;
        $this->initDatabase();
    }

    public function addTask(string $description, int $componentId, int $userId, int $parentId = null)
    {
        $query = 'INSERT INTO tasks.tasks (description,  goal_list_id, owner, parent_id, creator_id) VALUES (?,?,?,?,?) RETURNING id;';
        $stmt = $this->db->insert($query, [$description, $componentId, $userId, $parentId, $userId], true);
        if ($stmt) {
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if ($result) {
                return $this->fetchTaskById($result[0]['id']);
            }
        }
        return false;
    }

    /**
     * @return array<int, TaskItem>
     */
    public function fetchTaskById(int $taskId): array
    {
        if ($this->user) {
            $tasks = $this->db->select('select t.*, p.name as "permissionName", p.id as "permissionId"
                                            from tasks.tasks t
                                                     left join tasks_auth.user_task_permissions utp on t.id = utp.task_id
                                                     left join tv_auth.permissions p on utp.permission_id = p.id
                                            where t.id = ?
                                              and utp.user_id = ? ORDER BY t.id DESC;', [$taskId, $this->user->getId()]);
            return $this->convertTasksToTaskItem($tasks);
        }
        return [];
    }

    /**
     * @return array<int, TaskItem>
     */
    protected function convertTasksToTaskItem(array $tasks = []): array
    {
        $result = [];
        $map = [];
        foreach ($tasks as $task) {
            if (!isset($map[$task['id']])) {
                $map[$task['id']] = $task;
                $map[$task['id']]['permissions'] = [];
                $map[$task['id']]['permissions'][$task['permissionName']] = true;
                unset($map[$task['id']]['permissionName']);
                unset($map[$task['id']]['permissionId']);
            } else {
                $map[$task['id']]['permissions'][$task['permissionName']] = true;
            }
        }

        foreach ($map as $task) {
            $result[] = new TaskItem($task);
        }
        return $result;
    }

    /**
     * @return array<int, TaskItem>
     */
    public function fetchTasks(int $componentId): array
    {
        if ($this->user) {
            $tasks = $this->db->select('select t.*, p.name as "permissionName", p.id as "permissionId"
                                            from tasks.tasks t
                                                     left join tasks_auth.user_task_permissions utp on t.id = utp.task_id
                                                     left join tv_auth.permissions p on utp.permission_id = p.id
                                            where t.goal_list_id = ?
                                              and utp.user_id = ? ORDER BY t.id DESC;', [$componentId, $this->user->getId()]);
            return $this->convertTasksToTaskItem($tasks);
        }
        return [];
    }

    public function updateTaskDescription(int $taskId, string $description): TaskItem|false
    {
        $result = $this->db->update([
            'table' => 'tasks.tasks',
            'data' => [
                'description' => $description
            ],
            'where' => [
                'id' => $taskId,
            ]
        ]);
        if ($result) {
            $task = $this->fetchTaskById($taskId);
            return $task ? $task[0] : false;
        }
        return false;
    }

    public function updateTaskComplete(int $taskId, bool $complete): TaskItem|false
    {
        $result = $this->db->update([
            'table' => 'tasks.tasks',
            'data' => [
                'complete' => (int)$complete
            ],
            'where' => [
                'id' => $taskId,
            ]
        ]);
        if ($result) {
            return $this->fetchTaskById($taskId);
        }
        return false;
    }

    public function deleteTask(int $taskId): bool
    {
        return $this->db->delete('DELETE FROM tasks.tasks WHERE id = ?;', [$taskId]);
    }

    public function updateTaskNote(int $taskId, string $note): bool
    {
        return $this->db->update([
            'table' => 'tasks.tasks',
            'data' => [
                'note' => $note
            ],
            'where' => [
                'id' => $taskId,
            ]
        ]);
    }

    public function updateTaskDeadline(int $taskId, string $deadline): bool
    {
        return $this->db->update([
            'table' => 'tasks.tasks',
            'data' => [
                'deadline' => $deadline
            ],
            'where' => [
                'id' => $taskId,
            ]
        ]);
    }

    public function fetchSubtasks(int $taskId): array
    {
        $subtasks = $this->db->select("SELECT $this->fetchFields FROM tasks.tasks WHERE parent_id = ? ORDER BY id;", [$taskId]);
        if (!$subtasks) {
            return [];
        }
        return $subtasks;
    }
}
