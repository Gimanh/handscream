<?php

namespace App\Modules\Goals\Handlers;

use RuntimeException;
use ZXC\Native\Modules;
use App\Modules\Goals\Goals;
use ZXC\Modules\Auth\Exceptions\AuthModuleNotFound;

class GoalBaseHandler
{
    /**
     * @var null | Goals
     */
    protected $goals = null;

    /**
     * @throws AuthModuleNotFound
     */
    public function __construct()
    {
        $this->goals = Modules::get('goals');
        if (!$this->goals) {
            throw new RuntimeException('Module "Goals" undefined.');
        }
    }
}
