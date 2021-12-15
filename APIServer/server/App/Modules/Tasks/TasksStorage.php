<?php

namespace App\Modules\Tasks;

use App\Traits\AppDB;

class TasksStorage
{
    use AppDB;

    public function __construct()
    {
        $this->initDatabase();
    }

    public function addTask()
    {

    }

    public function fetchTasks()
    {

    }

    public function updateTasks()
    {

    }
}
