<?php

namespace App\Modules\Goals;

class GoalPermissions
{
    const CAN_DELETE = 'goal_can_delete';
    const CAN_EDIT = 'goal_can_edit';
    const CAN_ADD_USER = 'goal_can_add_users';

    public function __construct(array $permissions = [])
    {
        foreach ($permissions as $key => $value) {
            $this->{$key} = $value;
        }
    }

    public function hasPermissions(string $permissionName): bool
    {
        return property_exists($this, $permissionName);
    }
}
