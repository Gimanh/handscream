<?php

namespace App\Modules\GoalComponents;

use ZXC\Traits\Module;
use ZXC\Interfaces\IModule;
use App\Traits\GetAuthUser;

class GoalComponents implements IModule
{
    use Module, GetAuthUser;

    protected ?GoalComponentsStorage $storage = null;

    protected array $config = [];

    public function init(array $options = [])
    {
        $this->config = $options;
        $this->initUser();
        $this->storage = new GoalComponentsStorage($this->user);
    }

    public function addComponent(string $name, int $goalId): bool|array
    {
        return $this->storage->addComponent($name, $goalId, $this->user->getId());
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

    public function getGoalComponent(int $id): ?GoalComponentItem
    {
        $component = $this->storage->fetchComponentById($id);
        if ($component) {
            return $component[0];
        }
        return null;
    }
}
