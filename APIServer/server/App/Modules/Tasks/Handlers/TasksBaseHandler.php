<?php

namespace App\Modules\Tasks\Handlers;

use RuntimeException;
use ZXC\Native\Modules;
use App\Modules\Tasks\Tasks;


class TasksBaseHandler
{
    protected ?Tasks $tasks = null;

    public function __construct()
    {
        $this->tasks = Modules::get('tasks');
        if (!$this->tasks) {
            throw new RuntimeException('Module "Tasks" undefined.');
        }
    }
}
