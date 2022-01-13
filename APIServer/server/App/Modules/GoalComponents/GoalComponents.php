<?php

namespace App\Modules\GoalComponents;

use ZXC\Traits\Module;
use ZXC\Interfaces\IModule;

class GoalComponents implements IModule
{
    use Module;

    protected null|GoalComponentsStorage $storage = null;

    protected array $config = [];

    public function init(array $options = [])
    {
        $this->config = $options;
        $this->storage = new GoalComponentsStorage();
    }

    public function addComponent(string $name, int $goalId, int $userId)
    {
        return $this->storage->addComponent($name, $goalId, $userId);
    }

    public function fetchAll(int $goalId): null|array
    {
        return $this->storage->fetchAll($goalId);
    }

    public function updateComponent(int $id, string $name): bool|array
    {
        if ($this->storage->updateComponent($id, $name)) {
            return $this->storage->fetchComponentById($id);
        }
        return false;
    }

    public function deleteList(int $listId): bool
    {
        return $this->storage->deleteList($listId);
    }
}
