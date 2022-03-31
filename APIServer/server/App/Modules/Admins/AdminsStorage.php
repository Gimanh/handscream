<?php

namespace App\Modules\Admins;

use ZXC\Modules\Auth\Data\RegisterData;
use ZXC\Modules\DB\DB;

class AdminsStorage
{
    protected ?DB $db = null;

    public function __construct(?DB $db = null)
    {
        $this->db = $db;
    }

    public function fetchUsers(array $options = []): array|bool
    {
        return $this->db->select('select id, login, email, block from tv_auth.users', []);
    }

    public function checkUserLoginOrEmail(string $emailOrLogin): bool
    {
        $isEmail = !!filter_var($emailOrLogin, FILTER_VALIDATE_EMAIL);
        $query = 'select login from tv_auth.users where login = ?';
        if ($isEmail) {
            $query = 'select login from tv_auth.users where email = ?';
        }
        return !!$this->db->selectOne($query, [$emailOrLogin]);
    }

    public function addUser(RegisterData $userData): bool
    {
        return !!$this->db->insert(
            'insert into tv_auth.users (login, email,password, block ) VALUES (?,?,?,?)',
            [$userData->getLogin(), $userData->getEmail(), $userData->getPassword(), $userData->getBlock()]
        );
    }

    public function updateUser(array $userData): bool
    {
        $data = array_merge(['table' => 'tv_auth.users',], $userData);
        return $this->db->update($data);
    }

    public function deleteUser(int $id): bool
    {
        return $this->db->delete('delete from tv_auth.users where id = ?', [$id]);
    }
}
