<?php

namespace App\Modules\Admins;

use RuntimeException;
use ZXC\Interfaces\IModule;
use ZXC\Modules\Auth\Data\RegisterData;
use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;
use ZXC\Traits\Module;

class Admins implements IModule
{
    use Module;

    protected ?DB $db = null;

    protected array $config = [];

    protected ?AdminsStorage $adminsStorage = null;

    public function init(array $options = [])
    {
        $this->config = $options;
        $this->checkConfig();
        $this->createConnection();
        $this->adminsStorage = new AdminsStorage($this->db);
    }

    protected function checkConfig()
    {
        if (!isset($this->config['usersDbConnection'])) {
            throw new RuntimeException('Parameter "usersDbConnection" is required for module "Admins"');
        }
    }

    protected function createConnection()
    {
        $this->db = Modules::getNew('db', $this->config['usersDbConnection']);
    }

    public function fetchUsers(array $options = []): array|bool
    {
        return $this->adminsStorage->fetchUsers($options);
    }

    public function checkUserLoginOrEmail(string $emailOrLogin): bool
    {
        return $this->adminsStorage->checkUserLoginOrEmail($emailOrLogin);
    }

    public function addUser(array $userData): bool
    {
        $data = new RegisterData(
            $userData['login'],
            $userData['email'],
            $userData['password'],
            $userData['password'],
            (int)$userData['block']
        );
        return $this->adminsStorage->addUser($data);
    }

    public function updateUser(array $userData): bool
    {
        $allowUpdate = ['login', 'email', 'password', 'block'];
        if (count(array_keys($userData)) > 1) {
            if (!isset($userData['id'])) {
                throw new RuntimeException('Field "id" is required.');
            }
            $updateData = [
                'data' => [],
                'where' => [
                    'id' => (int)$userData['id']
                ]
            ];
            foreach ($userData as $key => $value) {
                if (in_array($key, $allowUpdate)) {
                    if ($key === 'password') {
                        $updateData['data'][$key] = RegisterData::passwordHash($value);
                    } else {
                        $updateData['data'][$key] = $value;
                    }
                }
            }
            if (count(array_keys($updateData['data'])) === 0) {
                return false;
            }
            return $this->adminsStorage->updateUser($updateData);
        }
        return false;
    }

    public function deleteUser(int $id): bool
    {
        return $this->adminsStorage->deleteUser($id);
    }
}
