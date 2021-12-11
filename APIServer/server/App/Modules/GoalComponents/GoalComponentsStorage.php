<?php

namespace App\Modules\GoalComponents;

use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;

class GoalComponentsStorage
{
    protected DB|null $db = null;

    public function __construct()
    {
        $this->db = Modules::get('db');
    }

    public function addComponent(string $name, int $goalId)
    {
        $stmt = $this->db->insert(
            'INSERT INTO tasks.goal_lists (name, goal_id) VALUES (?, ?) RETURNING id;',
            [$name, $goalId],
            true
        );
        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        if ($result) {
            return $this->fetchComponentById($result[0]['id']);
        }
        return false;
    }

    public function fetchComponentById(int $id)
    {
        return $this->db->selectOne('SELECT id, name FROM tasks.goal_lists WHERE id = ?;', [$id]);
    }

    public function fetchAll(int $goalId)
    {
        return $this->db->select('SELECT id, name FROM tasks.goal_lists WHERE goal_id = ?;', [$goalId]);
    }
}
