<?php

namespace App\Modules\GoalLists\Handlers;

use ZXC\Native\Modules;
use App\Modules\GoalLists\GoalLists;

class ListsBaseHandler
{
    protected GoalLists|null $goalLists = null;

    public function __construct()
    {
        $this->goalLists = Modules::get('GoalLists');
    }
}
