<?php

namespace App\Modules\Tasks;

use PDO;
use App\Traits\AppDB;

class TasksStorage
{
    use AppDB;

    protected string $fetchFields = '*';

    public function __construct(array $fetchFields = [])
    {
        $this->initDatabase();
    }

    public function addTask(string $description, int $componentId, int $userId, int $parentId = null)
    {
        $query = 'INSERT INTO tasks.tasks (description,  goal_list_id, owner, parent_id) VALUES (?,?,?,?) RETURNING id;';
        $stmt = $this->db->insert($query, [$description, $componentId, $userId, $parentId], true);
        if ($stmt) {
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if ($result) {
                return $this->fetchTaskById($result[0]['id']);
            }
        }
        return false;
    }

    public function fetchTaskById(int $taskId)
    {
        $task = $this->db->selectOne('SELECT ' . $this->fetchFields . ' FROM tasks.tasks WHERE id = ?;', [$taskId]);
        $task['subtasks'] = [];
        return $task;
    }

    /**
     * @return array<int, TaskItem>
     */
    public function fetchTasks(int $componentId): array
    {
        $result = [];
        $tasks = $this->db->select('SELECT ' . $this->fetchFields . ' FROM tasks.tasks WHERE goal_list_id = ? AND parent_id IS NULL ORDER BY id DESC;', [$componentId]);
        foreach ($tasks as $task) {
            $result[] = new TaskItem($task);
        }
        return $result;
    }

    public function updateTaskDescription(int $taskId, string $description): array|false
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
            return $this->fetchTaskById($taskId);
        }
        return false;
    }

    public function updateTaskComplete(int $taskId, bool $complete): array|false
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
