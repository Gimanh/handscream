<?php

namespace ZXC\Modules\Auth\Exceptions;

use Exception;

class InvalidChangeRemindedPasswordArgs extends Exception
{
    protected $message = 'Invalid args for changing reminded password.';
}
