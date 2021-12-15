<?php

namespace App\Modules\Tasks;

use PDO;
use App\Traits\AppDB;

class TasksStorage
{
    use AppDB;

    public function __construct()
    {
        $this->initDatabase();
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
        return $this->db->selectOne('SELECT id, description, complete FROM tasks.tasks WHERE id = ?;', [$taskId]);
    }

    public function fetchTasks(int $componentId)
    {
        return $this->db->select('SELECT id, description, complete FROM tasks.tasks WHERE goal_list_id = ?;', [$componentId]);
    }

    public function updateTasks()
    {

    }
}
