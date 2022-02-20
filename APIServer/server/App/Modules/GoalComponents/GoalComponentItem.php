<?php

namespace App\Modules\GoalComponents;

class GoalComponentItem
{
    public int $id;

    public string $name;

    public GoalComponentPermissions $permissions;

    public function __construct(array $component)
    {
        $this->id = $component['id'];
        $this->name = $component['name'];
        $this->permissions = new GoalComponentPermissions($component['permissions']);
    }
}
