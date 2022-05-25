<?php

namespace ZXC\Modules\Auth;

class User implements UserModel
{
    protected $id = null;

    protected $login = '';

    protected $email = '';

    protected $block = 0;

    protected $permissions = [];

    public function __construct(int $id, string $login = '', string $email = '', int $block = 0, array $permissions = [])
    {
        $this->id = $id;
        $this->login = $login;
        $this->email = $email;
        $this->block = $block;
        $this->preparePermissions($permissions);
    }

    public function preparePermissions(array $permissions)
    {
        foreach ($permissions as $permission) {
            $this->permissions[$permission['name']] = $permission;
        }
    }

    public function getLogin(): string
    {
        return $this->login;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function isBlocked(): int
    {
        return $this->block;
    }

    public function getPermissions(): array
    {
        return $this->permissions;
    }

    public function hasPermissions($permissionName): bool
    {
        return isset($this->permissions[$permissionName]);
    }

    public function getInfo(): array
    {
        return [
            'id' => $this->id,
            'login' => $this->login,
            'email' => $this->email,
            'permissions' => $this->getPermissions(),
        ];
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }
}
