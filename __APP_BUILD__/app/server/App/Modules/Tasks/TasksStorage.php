<?php

namespace App\Modules\Tasks;

use App\Modules\Tasks\Args\FetchTasksArg;
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

    protected ?PDOStatement $taskFetchTagsStatement = null;


    public function __construct(?User $user = null)
    {
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
        $processedTasks = [];
        $result = [];
        foreach ($tasks as &$task) {
            if (!isset($processedTasks[$task['id']])) {
                $taskPermissions = $this->fetchTaskPermissions($task['id']);
                foreach ($taskPermissions as $permission) {
                    $task['permissions'][$permission['name']] = true;
                }
                $task['tags'] = $this->fetchTagIdsForTask($task['id']);
                $result[] = new TaskItem($task);
                $processedTasks[$task['id']] = true;
            }
        }
        return $result;
    }

    public function fetchTagIdsForTask(int $taskId)
    {
        $pdo = $this->db->getConnection();
        if (!$this->taskFetchTagsStatement) {
            $this->taskFetchTagsStatement = $pdo->prepare('select tag_id from tasks.tasks_to_tags where task_id = ?');
        }
        $status = $this->taskFetchTagsStatement->execute([$taskId]);
        if ($status) {
            $tags = $this->taskFetchTagsStatement->fetchAll(PDO::FETCH_ASSOC);
            return array_map(function ($item) {
                return $item['tag_id'];
            }, $tags);
        }
        return [];
    }

    public function fetchTaskPermissions(int $taskId): array
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
    public function fetchTasks(FetchTasksArg $fetchTasksArg): array
    {
        if ($this->user) {
            $tasks = $this->db->select(
                $fetchTasksArg->getQuery(),
                $fetchTasksArg->getArgs()
            );
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
                'goal_list_id' => $goalListId,
                'parent_id' => null
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
