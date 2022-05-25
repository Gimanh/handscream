<?php

namespace ZXC\Modules\Auth\Exceptions;

use Exception;

class InvalidEmail extends Exception
{
    protected $message = 'Invalid email.';
}
