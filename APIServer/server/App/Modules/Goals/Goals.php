<?php

namespace App\Modules\Goals;

use ZXC\Traits\Module;
use App\Traits\GetAuthUser;
use ZXC\Interfaces\IModule;

class Goals implements IModule
{
    use Module, GetAuthUser;

    protected array $config = [];

    protected ?GoalsStorage $storage = null;

    public function init(array $options = [])
    {
        $this->config = $options;
        $this->initUser();
        if (isset($options['storage'])) {
            $this->storage = new $options['storage'];
        } else {
            $this->storage = new GoalsStorage($this->user);
        }
    }

    /**
     * @param string $name
     * @param $description
     * @param int $userId
     * @return GoalItem[]|false
     */
    public function addGoal(string $name, $description, int $userId): false|array
    {
        return $this->storage->addGoal($name, $userId, $description);
    }

    /**
     * @param $userId
     * @return GoalItem[]
     */
    public function fetchGoals($userId): array
    {
        return $this->storage->fetchGoals($userId);
    }

    /**
     * @param int $id
     * @param string $name
     * @param string $description
     * @return false|GoalItem[]
     */
    public function updateGoal(int $id, string $name, string $description): false|array
    {
        if ($this->storage->updateGoal($id, $name, $description)) {
            return $this->storage->fetchGoalById($id);
        }
        return false;
    }

    /**
     * @param int $id
     * @return bool
     */
    public function deleteGoal(int $id): bool
    {
        return $this->storage->deleteGoal($id);
    }

    /**
     * @param int $goalId
     * @return GoalItem|null
     */
    public function getGoal(int $goalId): ?GoalItem
    {
        $goal = $this->storage->fetchGoalById($goalId);
        if ($goal) {
            return $goal[0];
        }
        return null;
    }
}
