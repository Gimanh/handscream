<?php

namespace App\Traits;

use ZXC\Native\Modules;
use ZXC\Modules\Auth\User;
use ZXC\Modules\Auth\Auth;

trait GetAuthUser
{
    protected ?User $user = null;

    protected ?Auth $auth = null;

    public function initUser()
    {
        $this->auth = Modules::get('auth');
        $this->user = $this->auth->getUser();
    }
}
