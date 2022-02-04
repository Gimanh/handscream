<?php

namespace App\Modules\Tasks;

class TaskPermissions
{
    public function __construct(array $permissions = [])
    {
        foreach ($permissions as $key => $value) {
            $this->{$key} = $value;
        }
    }
}
