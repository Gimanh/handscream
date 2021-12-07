<?php

namespace App\Modules\Goals;

use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;

class GoalsStorage
{
    /** @var DB|null */
    protected $db = null;

    public function __construct()
    {
        $this->db = Modules::get('db');
    }

    public function addGoal(string $name, int $userId, $description = null, string $color = '')
    {
        $query = $description !== null ?
            'INSERT INTO tasks.goals (name,  owner, description) VALUES (?,?,?) RETURNING id;' :
            'INSERT INTO tasks.goals (name,  owner) VALUES (?,?) RETURNING id;';
        $args = $description !== null ?
            [$name, $userId, $description] :
            [$name, $userId];
        $stmt = $this->db->insert($query, $args, true);
        if ($stmt) {
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            if ($result) {
                return $this->fetchGoalById($result[0]['id']);
            }
        }
        return false;
    }

    public function fetchGoalById(int $id)
    {
        return $this->db->selectOne('SELECT id, name, description FROM tasks.goals WHERE id = ?;', [$id]);
    }

    public function fetchGoals($userId)
    {
        return $this->db->select('SELECT id, name, description FROM tasks.goals WHERE owner = ?;', [$userId]);
    }
}
