<?php

namespace App\Modules\Goals;

use PDO;
use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;
use ZXC\Modules\Auth\User;

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

    /**
     * @param string $name
     * @param int $userId
     * @param $description
     * @param string $color
     * @return false|GoalItem[]
     */
    public function addGoal(string $name, int $userId, $description = null, string $color = ''): false|array
    {
        $query = $description !== null ?
            'INSERT INTO tasks.goals (name,  owner, description) VALUES (?,?,?) RETURNING id;' :
            'INSERT INTO tasks.goals (name,  owner) VALUES (?,?) RETURNING id;';
        $args = $description !== null ?
            [$name, $userId, $description] :
            [$name, $userId];
        $stmt = $this->db->insert($query, $args, true);
        if ($stmt) {
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if ($result) {
                return $this->fetchGoalById($result[0]['id']);
            }
        }
        return false;
    }

    /**
     * @param int $id
     * @return GoalItem[]
     */
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

    /**
     * @param $userId
     * @return GoalItem[]
     */
    public function fetchGoals($userId): array
    {
        $goals = $this->db->select('select g.*, p.name as "permissionName", p.id as "permissionId"
                                            from tasks.goals g
                                                     left join tasks_auth.user_goal_permissions utp on g.id = utp.goal_id
                                                     left join tv_auth.permissions p on utp.permission_id = p.id
                                            where g.owner = ?
                                            order by g.id desc;', [$userId]);
        return $this->convertGoalToGoalItem($goals);
    }

    public function updateGoal(int $id, string $name, string $description): bool
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

    /**
     * @param int $id
     * @return bool
     */
    public function deleteGoal(int $id): bool
    {
        return $this->db->delete('DELETE FROM tasks.goals WHERE id = ?;', [$id]);
    }

    /**
     * @return GoalItem[]
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
