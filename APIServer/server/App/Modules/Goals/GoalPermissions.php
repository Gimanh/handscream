<?php

namespace App\Modules\Goals;

use JsonSerializable;

class GoalPermissions implements JsonSerializable
{
    const CAN_DELETE = 'goal_can_delete';
    const CAN_EDIT = 'goal_can_edit';
    const CAN_ADD_USER = 'goal_can_add_users';

    private $permissions = [];

    public function __construct(array $permissions = [])
    {
        $this->permissions = $permissions;
    }

    public function hasPermissions(string $permissionName): bool
    {
        return !!$this->permissions[$permissionName];
    }

    public function jsonSerialize(): mixed
    {
        return $this->permissions;
    }
}
