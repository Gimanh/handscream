<?php

namespace App\Traits;

use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;

trait AppDB
{
    protected DB|null $db = null;

    public function initDatabase()
    {
        $this->db = Modules::get('db');
    }
}
