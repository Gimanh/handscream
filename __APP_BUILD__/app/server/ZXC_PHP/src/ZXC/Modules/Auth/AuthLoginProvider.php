<?php

namespace ZXC\Modules\Auth;

use ZXC\Interfaces\Psr\Http\Message\RequestInterface;

interface AuthLoginProvider
{
    public function __construct(array $config, Auth $auth);

    public function login(array $userData): array;

    public function getLoginType(): string;

    public function logout(int $userId, string $token): bool;

    public function retrieveUserFromRequest(RequestInterface $request): ?UserModel;
}
