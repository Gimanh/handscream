<?php

namespace ZXC\Native\JWT\Exceptions;

use Exception;

class InvalidJWTToken extends Exception
{
    protected $message = 'Invalid token';
}
