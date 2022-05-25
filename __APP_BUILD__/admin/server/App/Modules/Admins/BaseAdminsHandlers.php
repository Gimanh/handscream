<?php

namespace App\Modules\Admins;

use ZXC\Native\Modules;

class BaseAdminsHandlers
{
    protected ?Admins $admins = null;

    public function __construct()
    {
        $this->admins = Modules::get('admins');
    }
}
