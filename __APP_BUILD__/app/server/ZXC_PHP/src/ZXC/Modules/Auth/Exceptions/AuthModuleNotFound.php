<?php

namespace ZXC\Modules\Auth\Exceptions;

use Exception;

class AuthModuleNotFound extends Exception
{
    protected $message = 'Module "Auth" not found. Add this module in config.';
}
