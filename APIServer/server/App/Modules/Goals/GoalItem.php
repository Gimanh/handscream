<?php

namespace App\Modules\Goals;

class GoalItem
{
    public ?int $id;
    public ?int $owner;
    public ?string $name;
    public ?string $color;
    public ?string $description;
    public GoalPermissions $permissions;

    public function __construct(array $goal)
    {
        $this->id = $goal['id'];
        $this->owner = $goal['owner'];
        $this->name = $goal['name'];
        $this->color = $goal['color'];
        $this->description = $goal['description'];
        $this->permissions = new GoalPermissions($goal['permissions']);
    }

    public function hasPermissions(string $permissionName)
    {
        return $this->permissions->hasPermissions($permissionName);
    }
}
