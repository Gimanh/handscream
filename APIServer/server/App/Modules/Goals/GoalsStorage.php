<?php

namespace App\Modules\Goals;

use ZXC\Modules\Auth\User;
use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;

class GoalsStorage
{
    /** @var DB|null */
    protected $db = null;

    protected ?User $user = null;

    public function __construct(?User $user = null)
    {
        $this->user = $user;
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

    public function fetchGoalById(int $id): array
    {
        $goals = $this->db->select('select g.*, p.name as "permissionName", p.id as "permissionId"
                                            from tasks.goals g
                                                     left join tasks_auth.user_goal_permissions utp on g.id = utp.goal_id
                                                     left join tv_auth.permissions p on utp.permission_id = p.id
                                            where g.id = ?
                                              and utp.user_id = ? ORDER BY g.id DESC;', [$id, $this->user->getId()]);
        return $this->convertGoalToGoalItem($goals);
    }

    public function fetchGoals($userId)
    {
        $goals = $this->db->select('select g.*, p.name as "permissionName", p.id as "permissionId"
                                            from tasks.goals g
                                                     left join tasks_auth.user_goal_permissions utp on g.id = utp.goal_id
                                                     left join tv_auth.permissions p on utp.permission_id = p.id
                                            where g.owner = ?
                                            order by g.id desc;', [$userId]);
        return $this->convertGoalToGoalItem($goals);
    }

    public function updateGoal(int $id, string $name, string $description)
    {
        return $this->db->update([
            'table' => 'tasks.goals',
            'data' => [
                'name' => $name,
                'description' => $description
            ],
            'where' => [
                'id' => $id,
            ]
        ]);
    }

    public function deleteGoal(int $id)
    {
        return $this->db->delete('DELETE FROM tasks.goals WHERE id = ?;', [$id]);
    }

    /**
     * @return array<int, GoalItem>
     */
    protected function convertGoalToGoalItem(array $goals = []): array
    {
        $result = [];
        $map = [];
        foreach ($goals as $goal) {
            if (!isset($map[$goal['id']])) {
                $map[$goal['id']] = $goal;
                $map[$goal['id']]['permissions'] = [];
                $map[$goal['id']]['permissions'][$goal['permissionName']] = true;
                unset($map[$goal['id']]['permissionName']);
                unset($map[$goal['id']]['permissionId']);
            } else {
                $map[$goal['id']]['permissions'][$goal['permissionName']] = true;
            }
        }

        foreach ($map as $goal) {
            $result[] = new GoalItem($goal);
        }
        return $result;
    }
}
