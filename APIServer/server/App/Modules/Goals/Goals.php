<?php

namespace App\Modules\Goals;

use ZXC\Interfaces\IModule;
use ZXC\Traits\Module;

class Goals implements IModule
{
    use Module;

    /** @var array */
    protected $config = [];

    /** @var GoalsStorage|null */
    protected $storage = null;

    public function init(array $options = [])
    {
        $this->config = $options;
        if (isset($options['storage'])) {
            $this->storage = new $options['storage'];
        } else {
            $this->storage = new GoalsStorage();
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
}
