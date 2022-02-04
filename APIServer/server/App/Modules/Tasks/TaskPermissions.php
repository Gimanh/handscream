<?php

namespace App\Modules\Tasks;

class TaskPermissions
{
    const CAN_DELETE = 'task_can_delete';
    const CAN_EDIT_DESCRIPTION = 'task_can_edit_description';
    const CAN_EDIT_STATUS = 'task_can_edit_status';
    const CAN_EDIT_NOTE = 'task_can_edit_note';
    const CAN_EDIT_DEADLINE = 'task_can_edit_deadline';
    const CAN_WATCH_DETAILS = 'task_can_watch_details';
    const CAN_WATCH_SUBTASKS = 'task_can_watch_subtasks';
    const CAN_ADD_SUBTASKS = 'task_can_add_subtasks';

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
