<?php

namespace ZXC\Modules\Auth\Storages;

use PDO;
use Exception;
use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;
use ZXC\Modules\Auth\AuthTokenStorage;

class AuthTokenStoragePgSql implements AuthTokenStorage
{
    /** @var DB | null */
    protected $db = null;

    /**
     * @throws Exception
     */
    public function __construct()
    {
        $this->db = Modules::get('db');

        if (!$this->db) {
            throw new Exception('Module "DB" is required for "AuthTokenStoragePgSql".');
        }
    }

    public function initTokenRecord(int $userId, string $userIp): int
    {
        $pdo = $this->db->getConnection();
        $stmt = $pdo->prepare('INSERT INTO tv_auth.user_tokens (user_id, user_ip) VALUES (?, ?) RETURNING id;');
        $exec = $stmt->execute([$userId, $userIp]);
        if ($exec) {
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if ($result) {
                return $result[0]['id'];
            }
        }
        return -1;
    }

    public function updateTokens(string $accessToken, string $refreshToken, int $rowId): bool
    {
        $pdo = $this->db->getConnection();
        $stmt = $pdo->prepare('UPDATE tv_auth.user_tokens SET access_token = ?, refresh_token = ? WHERE id = ?;');
        return !!$stmt->execute([$accessToken, $refreshToken, $rowId]);
    }

    public function fetchTokens(int $rowId): array
    {
        $pdo = $this->db->getConnection();
        $stmt = $pdo->prepare('SELECT * FROM tv_auth.user_tokens WHERE id = ?;');
        $exec = $stmt->execute([$rowId]);
        if ($exec) {
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (isset($result[0])) {
                return $result[0];
            }
        }
        return [];
    }

    public function deleteTokens(int $userId, string $accessToken): bool
    {
        $query = 'DELETE FROM tv_auth.user_tokens WHERE user_id = ? AND access_token = ?;';
        return $this->db->delete($query, [$userId, $accessToken]);
    }
}
