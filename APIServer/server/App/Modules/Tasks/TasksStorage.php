<?php

namespace App\Modules\Tasks;

use PDO;
use App\Traits\AppDB;
use PDOStatement;
use ZXC\Modules\Auth\User;

class TasksStorage
{
    use AppDB;

    protected string $fetchFields = '*';

    protected ?User $user = null;

    protected ?PDOStatement $tasksPermissionsStatement = null;

    protected int $limit = 20;

    public function __construct(?User $user = null, ?int $limit = null)
    {
        if ($limit) {
            $this->limit = $limit;
        }
        $this->user = $user;
        $this->initDatabase();
    }

    public function addTask(string $description, int $componentId, int $creatorId, int $parentId = null)
    {
        $query = 'INSERT INTO tasks.tasks (description,  goal_list_id, parent_id, creator_id) VALUES (?,?,?,?) RETURNING id;';
        $stmt = $this->db->insert($query, [$description, $componentId, $parentId, $creatorId], true);
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
            $tasks = $this->db->select('select t.*
                                                from tasks.tasks t
                                                         left join tasks_auth.user_task_permissions utp on t.id = utp.task_id
                                                where t.id = ?
                                                  and utp.user_id = ?
                                                order by t.id desc;', [$taskId, $this->user->getId()]);
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
        foreach ($tasks as &$task) {
            $taskPermissions = $this->fetchTaskPermissions($task['id']);
            foreach ($taskPermissions as $permission) {
                $task['permissions'][$permission['name']] = true;
            }
            $result[] = new TaskItem($task);
        }
        return $result;
    }

    public function fetchTaskPermissions($taskId): array
    {
        $pdo = $this->db->getConnection();
        if (!$this->tasksPermissionsStatement) {
            $this->tasksPermissionsStatement = $pdo->prepare('select p.* from tasks_auth.user_task_permissions
                                        left join tv_auth.permissions p on user_task_permissions.permission_id = p.id
                                        where task_id = ?');
        }
        $status = $this->tasksPermissionsStatement->execute([$taskId]);
        if ($status) {
            return $this->tasksPermissionsStatement->fetchAll(PDO::FETCH_ASSOC);
        }
        return [];
    }

    /**
     * @return array<int, TaskItem>
     */
    public function fetchTasks(int $componentId, int $page, int $showCompleted): array
    {
        $offset = 0;
        if ($page > 0) {
            $offset = $page * $this->limit;
        }
        if ($this->user) {
            $tasks = $this->db->select('select distinct on (t.id) t.*
                                                from tasks.tasks t
                                                         left join tasks_auth.user_task_permissions utp on t.id = utp.task_id
                                                where t.goal_list_id = ?
                                                  and utp.user_id = ?
                                                  and parent_id is null
                                                  and complete = ?
                                                order by t.id desc
                                                offset ? limit ?;', [$componentId, $this->user->getId(), $showCompleted, $offset, $this->limit]);
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
            $task = $this->fetchTaskById($taskId);
            return $task ? $task[0] : false;
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

    /**
     * @param int $taskId
     * @return array<int, TaskItem>
     */
    public function fetchSubtasks(int $taskId): array
    {
        $subtasks = $this->db->select('select distinct on (t.id) t.*
                                                from tasks.tasks t
                                                         left join tasks_auth.user_task_permissions utp on t.id = utp.task_id
                                                where t.parent_id = ?
                                                ORDER BY t.id DESC;', [$taskId]);
        return $this->convertTasksToTaskItem($subtasks);
    }

    public function moveTask(int $taskId, int $goalListId): bool
    {
        return $this->db->update([
            'table' => 'tasks.tasks',
            'data' => [
                'goal_list_id' => $goalListId
            ],
            'where' => [
                'id' => $taskId,
            ]
        ]);
    }

    public function fetchAppPriorities(): array
    {
        return $this->db->select('select * from tasks.priority order by id', []);
    }

    public function updatePriority(int $taskId, int $priorityId): bool
    {
        return $this->db->update([
            'table' => 'tasks.tasks',
            'data' => [
                'priority_id' => $priorityId
            ],
            'where' => [
                'id' => $taskId,
            ]
        ]);
    }
}
