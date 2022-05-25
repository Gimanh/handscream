<?php

namespace App\Modules\About\Handlers;

use ZXC\Native\Modules;
use App\Modules\About\About;

class BaseAbout
{
    protected ?About $about = null;

    public function __construct()
    {
        $this->about = Modules::get('about');
    }
}
