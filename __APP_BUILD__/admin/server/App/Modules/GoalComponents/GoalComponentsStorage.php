<?php

namespace App\Modules\GoalComponents;

use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;
use ZXC\Modules\Auth\User;

class GoalComponentsStorage
{
    protected ?DB $db = null;

    protected ?User $user = null;

    public function __construct(?User $user = null)
    {
        $this->user = $user;
        $this->db = Modules::get('db');
    }

    /**
     * @param string $name
     * @param int $goalId
     * @param int $userId
     * @return array<int, GoalComponentItem>|false
     */
    public function addComponent(string $name, int $goalId, int $userId): bool|array
    {
        $stmt = $this->db->insert(
            'INSERT INTO tasks.goal_lists (name, goal_id, creator_id) VALUES (?, ?, ?) RETURNING id;',
            [$name, $goalId, $userId],
            true
        );
        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        if ($result) {
            return $this->fetchComponentById($result[0]['id']);
        }
        return false;
    }

    /**
     * @param int $id
     * @return array<int, GoalComponentItem>|null
     */
    public function fetchComponentById(int $id): null|array
    {
        $components = $this->db->select('SELECT g.*, p.name as "permissionName", p.id as "permissionId"
                                                FROM tasks.goal_lists g
                                                         LEFT JOIN tasks_auth.user_component_permissions ucp on g.id = ucp.component_id
                                                         LEFT JOIN tv_auth.permissions p on ucp.permission_id = p.id
                                                WHERE g.id = ?
                                                  AND ucp.user_id = ?
                                                ORDER BY id DESC;', [$id, $this->user->getId()]);
        return $this->convertComponentsToComponentItems($components);
    }

    /**
     * @param int $goalId
     * @return array<int, GoalComponentItem>|null
     */
    public function fetchAll(int $goalId): null|array
    {
        $components = $this->db->select('SELECT g.*, p.name as "permissionName", p.id as "permissionId"
                                                FROM tasks.goal_lists g
                                                         LEFT JOIN tasks_auth.user_component_permissions ucp on g.id = ucp.component_id
                                                         LEFT JOIN tv_auth.permissions p on ucp.permission_id = p.id
                                                WHERE goal_id = ?
                                                  AND ucp.user_id = ?
                                                ORDER BY id DESC;', [$goalId, $this->user->getId()]);
        return $this->convertComponentsToComponentItems($components);
    }

    /**
     * @param array $components
     * @return array<int, GoalComponentItem>
     */
    public function convertComponentsToComponentItems(array $components): array
    {
        $result = [];
        $map = [];
        foreach ($components as $component) {
            if (!isset($map[$component['id']])) {
                $map[$component['id']] = $component;
                $map[$component['id']]['permissions'] = [];
                $map[$component['id']]['permissions'][$component['permissionName']] = true;
                unset($map[$component['id']]['permissionName']);
                unset($map[$component['id']]['permissionId']);
            } else {
                $map[$component['id']]['permissions'][$component['permissionName']] = true;
            }
        }

        foreach ($map as $component) {
            $result[] = new GoalComponentItem($component);
        }
        return $result;
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
