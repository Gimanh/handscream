<?php

namespace App\Modules\GoalComponents;

class GoalComponentPermissions
{
    const CAN_DELETE = 'component_can_delete';
    const CAN_EDIT = 'component_can_edit';
    const CAN_WATCH_CONTENT = 'component_can_watch_content';
    const CAN_ADD_TASKS = 'component_can_add_tasks';
    const CAN_ADD_SUBTASKS = 'component_can_add_subtasks';
    const CAN_EDIT_ALL_TASKS = 'component_can_edit_all_tasks';
    const CAN_EDIT_THEIR_TASKS = 'component_can_edit_their_tasks';

    private $permissions = [];

    public function __construct(array $permissions = [])
    {
        foreach ($permissions as $key => $value) {
            $this->permissions[$key] = $value;
        }
    }

    public function hasPermissions(string $permissionName): bool
    {
        return !!$this->permissions[$permissionName];
    }
}
