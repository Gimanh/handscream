<?php

namespace App;

use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;

class AppBase
{
    /** @var DB|null */
    protected $db = null;

    public function __construct()
    {
        $this->db = Modules::get('db');
    }
}
