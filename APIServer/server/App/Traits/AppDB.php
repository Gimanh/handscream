<?php

namespace App\Traits;

use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;

trait AppDB
{
    protected ?DB $db;

    public function initDatabase()
    {
        $this->db = Modules::get('db');
    }
}
