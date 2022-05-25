<?php

namespace ZXC\Native\JWT\Exceptions;

use Exception;

class InvalidAlgorithm extends Exception
{
    protected $message = 'Algorithm not supported';
}
