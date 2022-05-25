<?php

namespace ZXC\Modules\Auth;

use ZXC\Modules\Auth\Data\RegisterData;

interface AuthStorage
{
    const USER_NOT_INSERTED = -1;

    public function fetchUserByLogin(string $login): array|false;

    public function fetchUserByEmail(string $email): array|false;

    public function fetchUserPermissions(int $userId): array;

    /**
     * Add user to database
     * @param RegisterData $registerData
     * @return int -1 or inserted user id
     */
    public function insertUser(RegisterData $registerData): int;

    public function fetchUserById(int $id): array|false;

    public function confirmEmail(string $login, string $code, int $block): bool;

    public function setReminderCodeAndTime(string $email, ?string $code, ?int $time): bool;

    public function updateUserPassword(string $password, int $userId): bool;
}
