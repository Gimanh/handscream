<?php

namespace ZXC\Modules\Auth\Exceptions;

use Exception;

class InvalidConfirmEmailArgs extends Exception
{
    protected $message = 'Arguments for email conformation can not be empty.';
}
