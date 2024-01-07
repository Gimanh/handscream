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
    const CAN_EDIT_TAGS = 'task_can_edit_tags';
    const CAN_WATCH_TAGS = 'task_can_watch_tags';
    const CAN_EDIT_PRIORITY = 'task_can_edit_priority';
    const CAN_WATCH_PRIORITY = 'task_can_watch_priority';
    const CAN_ACCESS_HISTORY = 'task_can_access_history';
    const CAN_RECOVERY_HISTORY = 'task_can_recovery_history';

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

    public function jsonSerialize(): mixed
    {
        return $this->permissions;
    }
}
