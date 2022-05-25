<?php

namespace ZXC\Modules\Auth\Exceptions;

use Exception;

class PasswordMismatch extends Exception
{
    protected $message = 'Password mismatch.';
}
