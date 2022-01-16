<?php

namespace App\Modules\Tasks;

class TaskPermissions
{
    public bool $editDescription = false;
    public bool $editDeadline = false;
    public bool $editNode = false;
    public bool $editStatus = false;
    public bool $watchDetails = false;
    public bool $delete = false;

    public function __construct()
    {

    }
}
