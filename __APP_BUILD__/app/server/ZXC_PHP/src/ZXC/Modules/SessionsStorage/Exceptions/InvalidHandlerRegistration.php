<?php

namespace ZXC\Modules\SessionsStorage\Exceptions;

use Exception;

class InvalidHandlerRegistration extends Exception
{
    protected $message = 'Can not set session_set_save_handler';
}
