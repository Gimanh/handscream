<?php

namespace App\Modules\Tasks;

use ZXC\Modules\Auth\User;

class TaskPermissions
{
    public bool $editDescription = false;
    public bool $editDeadline = false;
    public bool $editNode = false;
    public bool $editStatus = false;
    public bool $watchDetails = false;
    public bool $delete = false;
    public bool $watchSubtasks = false;
    public bool $addSubtasks = false;

    public function __construct(int $owner, ?User $user = null)
    {
        if ($owner === $user?->getId()) {
            $this->editDescription = true;
            $this->editDeadline = true;
            $this->editNode = true;
            $this->editStatus = true;
            $this->watchDetails = true;
            $this->delete = true;
            $this->watchSubtasks = true;
            $this->addSubtasks = true;
        }
    }
}
