<?php

namespace App\Modules\Tasks;

use RuntimeException;
use ZXC\Modules\Auth\User;

class TaskItem
{
    public int|null $id;
    public int|null $parentId;
    public string|null $description;
    public bool $complete;
    public int|null $goalListId;
    public string $dateCreation;
    public int $owner;
    public int|null $historySection;
    public int|null $responsibleId;
    public string|null $deadline;
    public string|null $dateComplete;
    public string|null $note;
    /** @var array<int, TaskItem> */
    public array $subtasks = [];
    public TaskPermissions $permissions;

    public function __construct(array $task, ?User $user = null)
    {
        $this->id = $task['id'] ?? null;
        $this->parentId = $task['parent_id'] ?? null;
        $this->description = $task['description'] ?? null;
        $this->complete = $task['complete'] ?? null;
        $this->goalListId = $task['goal_list_id'] ?? null;
        $this->dateCreation = $task['date_creation'] ?? null;
        $this->owner = $task['owner'];
        if (!$this->owner) {
            throw new RuntimeException("Owner is requires for task $this->id.");
        }
        $this->historySection = $task['history_section'] ?? null;
        $this->responsibleId = $task['responsible_id'] ?? null;
        $this->deadline = $task['deadline'] ?? null;
        $this->dateComplete = $task['date_complete'] ?? null;
        $this->note = $task['note'] ?? null;
        $this->permissions = new TaskPermissions($this->owner, $user);
    }
}
