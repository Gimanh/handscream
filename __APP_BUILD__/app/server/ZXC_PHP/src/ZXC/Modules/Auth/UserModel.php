<?php

namespace ZXC\Modules\Auth;

interface UserModel
{
    public function getLogin(): string;

    public function getEmail(): string;

    public function isBlocked(): int;

    public function getPermissions(): array;

    public function hasPermissions($permissionName): bool;

    public function getInfo(): array;
}
