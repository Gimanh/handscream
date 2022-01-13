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

    public function addComponent(string $name, int $goalId, int $userId): bool|array
    {
        $stmt = $this->db->insert(
            'INSERT INTO tasks.goal_lists (name, goal_id, owner) VALUES (?, ?, ?) RETURNING id;',
            [$name, $goalId, $userId],
            true
        );
        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        if ($result) {
            return $this->fetchComponentById($result[0]['id']);
        }
        return false;
    }

    public function fetchComponentById(int $id): null|array
    {
        return $this->db->selectOne('SELECT id, name FROM tasks.goal_lists WHERE id = ?;', [$id]);
    }

    public function fetchAll(int $goalId): null|array
    {
        return $this->db->select('SELECT id, name FROM tasks.goal_lists WHERE goal_id = ? ORDER BY id DESC;', [$goalId]);
    }

    public function updateComponent(int $id, string $name): bool
    {
        return $this->db->update([
            'table' => 'tasks.goal_lists',
            'data' => [
                'name' => $name,
            ],
            'where' => [
                'id' => $id,
            ]
        ]);
    }

    public function deleteList(int $listId): bool
    {
        return $this->db->delete('DELETE FROM tasks.goal_lists WHERE id = ?;', [$listId]);
    }
}
