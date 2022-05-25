<?php

namespace ZXC\Modules\Auth;

interface AuthTokenStorage
{
    public function initTokenRecord(int $userId, string $userIp): int;

    public function updateTokens(string $accessToken, string $refreshToken, int $rowId): bool;

    public function fetchTokens(int $rowId): array;

    public function deleteTokens(int $userId, string $accessToken): bool;
}
