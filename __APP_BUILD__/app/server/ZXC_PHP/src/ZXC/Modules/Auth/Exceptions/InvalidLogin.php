<?php

namespace ZXC\Modules\Auth\Exceptions;

use Exception;

class InvalidLogin extends Exception
{
    protected $message = 'Login invalid.';
}
