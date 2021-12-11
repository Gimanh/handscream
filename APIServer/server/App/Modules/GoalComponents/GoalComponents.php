<?php

namespace App\Modules\GoalComponents;

use ZXC\Interfaces\IModule;
use ZXC\Traits\Module;

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

    public function addComponent(string $name, int $goalId)
    {
        return $this->storage->addComponent($name, $goalId);
    }

    public function fetchAll(int $goalId)
    {
        return $this->storage->fetchAll($goalId);
    }
}
