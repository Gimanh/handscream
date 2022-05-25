<?php

namespace ZXC\Modules\Auth\Handlers;

use ZXC\Native\Modules;
use ZXC\Modules\Auth\Auth;
use ZXC\Modules\Auth\Exceptions\AuthModuleNotFound;

class BaseAuthHandler
{
    protected ?Auth $auth;

    /**
     * @throws AuthModuleNotFound
     */
    public function __construct()
    {
        $this->auth = Modules::get('auth');
        if (!$this->auth) {
            throw new AuthModuleNotFound();
        }
    }
}
