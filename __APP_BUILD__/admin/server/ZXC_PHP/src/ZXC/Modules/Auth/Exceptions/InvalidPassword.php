<?php

namespace ZXC\Modules\Auth\Exceptions;

use Exception;

class InvalidPassword extends Exception
{
    protected $message = 'Invalid password.';
}
