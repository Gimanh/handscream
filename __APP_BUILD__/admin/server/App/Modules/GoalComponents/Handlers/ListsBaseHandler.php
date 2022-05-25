<?php

namespace App\Modules\GoalComponents\Handlers;

use ZXC\Native\Modules;
use App\Modules\GoalComponents\GoalComponents;

class ListsBaseHandler
{
    protected GoalComponents|null $goalLists = null;

    public function __construct()
    {
        $this->goalLists = Modules::get('GoalComponents');
    }
}
