<?php

namespace App\Modules\GoalLists;

use ZXC\Interfaces\IModule;
use ZXC\Traits\Module;

class GoalLists implements IModule
{
    use Module;

    protected null|GoalListsStorage $storage = null;

    protected array $config = [];

    public function init(array $options = [])
    {
        $this->config = $options;
        $this->storage = new GoalListsStorage();
    }

    public function addComponent(string $name, int $goalId)
    {
        return $this->storage->addComponent($name, $goalId);
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
