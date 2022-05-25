<?php

namespace ZXC\Modules\Auth\Exceptions;

use Exception;

class InvalidChangePasswordArgs extends Exception
{
    protected $message = 'Invalid args for password changing.';
}
