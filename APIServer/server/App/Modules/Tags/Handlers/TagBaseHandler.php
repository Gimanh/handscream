<?php

namespace App\Modules\Tags\Handlers;

use App\Modules\Tags\Tags;
use ZXC\Native\Modules;

class TagBaseHandler
{
    protected ?Tags $tags = null;

    public function __construct()
    {
        $this->tags = Modules::get('tags');
    }
}
