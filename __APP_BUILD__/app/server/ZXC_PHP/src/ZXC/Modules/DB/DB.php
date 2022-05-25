<?php

namespace ZXC\Modules\DB;

use PDO;
use PDOException;
use ZXC\Traits\Module;
use ZXC\Interfaces\IModule;

class DB implements IModule
{
    use Module;

    /**
     * @var null | PDO
     */
    protected $pdo = null;
    /**
     * @var null | string
     */
    protected $errorCode = null;

    /**
     * @var null | string
     */
    protected $errorMessage = null;

    public function init(array $options = [])
    {
        $dsn = $options['dsn'] ?? null;
        $username = $options['username'] ?? null;
        $password = $options['password'] ?? null;
        $pdoOptions = $options['options'] ?? null;

        try {
            $this->pdo = new PDO($dsn, $username, $password, $pdoOptions);
        } catch (PDOException $e) {
            $this->errorCode = $e->getCode();
            $this->errorMessage = $e->getMessage();
        }
    }

    /**
     * @return null|string
     */
    public function getErrorCode()
    {
        return $this->errorCode;
    }

    /**
     * @return null|string
     */
    public function getErrorMessage()
    {
        return $this->errorMessage;
    }

    /**
     * @return PDO|null
     */
    public function getConnection(): ?PDO
    {
        return $this->pdo;
    }

    public function close()
    {
        $this->pdo = null;
    }

    public function selectOne($query, $args)
    {
        $stmt = $this->pdo->prepare($query);
        $status = $stmt->execute($args);
        if ($status) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return null;
    }

    public function insert(string $query, array $args, bool $returnStmt = false)
    {
        $stmt = $this->pdo->prepare($query);
        $result = $stmt->execute($args);
        if ($result && $returnStmt) {
            return $stmt;
        }
        return $result;
    }

    /**
     * @param $query
     * @param $args
     * @return bool
     */
    public function delete($query, $args)
    {
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute($args);
    }

    /**
     * @param $query
     * @param $args
     * @return array|null
     */
    public function select($query, $args)
    {
        $stmt = $this->pdo->prepare($query);
        $status = $stmt->execute($args);
        if ($status) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        return null;
    }

    /**
     * @param array $update
     * @return bool
     */
    public function update(array $update)
    {
        $args = [];
        $query = 'UPDATE ' . $update['table'] . PHP_EOL;
        $query .= 'SET' . PHP_EOL;
        $fields = [];
        foreach ($update['data'] as $fieldName => $valueData) {
            $fields[] = $fieldName . ' = ?';
            $args[] = $valueData;
        }
        $query .= implode(',', $fields) . PHP_EOL;
        $query .= ' WHERE ' . PHP_EOL;
        $where = [];
        foreach ($update['where'] as $fieldWhere => $valueWhere) {
            $where[] = $fieldWhere . ' = ?';
            $args[] = $valueWhere;
        }
        $query .= implode('AND', $where);
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute($args);
    }
}
