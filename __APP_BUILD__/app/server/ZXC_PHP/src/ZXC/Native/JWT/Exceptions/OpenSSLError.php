<?php

namespace ZXC\Native\JWT\Exceptions;

use Exception;

class OpenSSLError extends Exception
{
    protected $message = 'OpenSSL error';
}
