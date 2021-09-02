<?php

namespace App\Auth;

class RegistrationCodeProvider
{
    public function __invoke($data)
    {
        return true;
    }
}
