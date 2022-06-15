<?php

namespace App\Modules\Tasks;

use RuntimeException;

class TaskItem
{
    public ?int $id;
    public ?int $parentId;
    public ?string $description;
    public bool $complete;
    public ?int $goalListId;
    public string $dateCreation;
    public int $owner;
    public ?int $historySection;
    public ?int $responsibleId;
    public ?string $deadline;
    public ?string $dateComplete;
    public ?string $note;
    /** @var array<int, TaskItem> */
    public array $subtasks = [];
    public TaskPermissions $permissions;
    public array $responsibleUser;
    public ?int $priorityId;
    public array $tags = [];

    public ?int $historyId;
    public ?bool $canNotRecovery;
    public ?string $parentIdDescription;
    public ?string $goalListIdDescription;
    public ?string $completeDescription;


    public function __construct(array $task)
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
        $this->permissions = new TaskPermissions($task['permissions']);

        if ($this->hasPermissions(TaskPermissions::CAN_WATCH_TAGS)) {
            $this->tags = $task['tags'] ?? [];
        } else {
            $this->tags = [];
        }

        if ($this->hasPermissions(TaskPermissions::CAN_WATCH_PRIORITY)) {
            $this->priorityId = $task['priority_id'];
        }

        $this->historyId = $task['history_id'] ?? null;
        $this->canNotRecovery = $task['can_not_recovery'] ?? null;
        $this->parentIdDescription = $task['parent_id_description'] ?? null;
        $this->goalListIdDescription = $task['goal_list_id_description'] ?? null;
        $this->completeDescription = $task['complete_description'] ?? null;
    }

    public function setResponsibleUser(array $responsibleUser): void
    {
        $this->responsibleUser = $responsibleUser;
    }

    public function hasPermissions(string $permissionName): bool
    {
        return $this->permissions->hasPermissions($permissionName);
    }
}
