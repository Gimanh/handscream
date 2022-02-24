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

    public function addGoal(string $name, $description, int $userId)
    {
        return $this->storage->addGoal($name, $userId, $description);
    }

    public function fetchGoals($userId)
    {
        return $this->storage->fetchGoals($userId);
    }

    public function updateGoal(int $id, string $name, string $description)
    {
        if ($this->storage->updateGoal($id, $name, $description)) {
            return $this->storage->fetchGoalById($id);
        }
        return false;
    }

    public function deleteGoal(int $id): bool
    {
        return $this->storage->deleteGoal($id);
    }

    public function getGoal(int $goalId): ?GoalItem
    {
        $goal = $this->storage->fetchGoalById($goalId);
        if ($goal) {
            return $goal[0];
        }
        return null;
    }
}
