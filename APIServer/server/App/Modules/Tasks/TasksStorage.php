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
        if (count($fetchFields) > 0) {
            $this->fetchFields = implode(',', $fetchFields);
        }
    }

    public function addTask(string $description, int $componentId, int $userId)
    {
        $query = 'INSERT INTO tasks.tasks (description,  goal_list_id, owner) VALUES (?,?,?) RETURNING id;';
        $args = [$description, $componentId, $userId];
        $stmt = $this->db->insert($query, $args, true);
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
        return $this->db->selectOne('SELECT ' . $this->fetchFields . ' FROM tasks.tasks WHERE id = ?;', [$taskId]);
    }

    public function fetchTasks(int $componentId)
    {
        return $this->db->select('SELECT ' . $this->fetchFields . ' FROM tasks.tasks WHERE goal_list_id = ? ORDER BY id DESC;', [$componentId]);
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
}
