<?php

namespace App\Modules\DbMigration;

use PDO;
use Exception;
use PDOException;
use RuntimeException;
use ZXC\Traits\Module;
use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;
use ZXC\Interfaces\IModule;

class DbMigration implements IModule
{
    use Module;

    const CURRENT_VERSION_IS_LESS = -1;
    const VERSIONS_ARE_EQUAL = 0;
    const CURRENT_VERSION_IS_GREATER = 1;

    protected array $config = [];

    protected ?DB $db = null;

    private ?string $dsn = null;

    private ?string $version = null;

    protected ?PDO $pdo = null;

    protected ?string $baseDir = null;

    protected array $createData = [];

    protected array $migrationData = [];

    public function init(array $options = [])
    {
        $this->config = $options;
        $this->db = Modules::get('db');
        $this->pdo = $this->db->getConnection();
    }

    public function setEnvironment(string $directory, string $dsn)
    {
        $this->baseDir = $directory;
        $this->dsn = $dsn;
        $this->createData = json_decode(file_get_contents($this->baseDir . '/install.json'), true);
        $this->migrationData = json_decode(file_get_contents($this->baseDir . '/migrate.json'), true);
    }

    public function fetchVersion()
    {
        $result = $this->db->select('SELECT * FROM app.version WHERE id = ?;', [1]);
        if (!$result) {
            throw new RuntimeException('Can not fetch version from DB');
        }
        $this->version = $result[0]['version'];
    }

    public function compareVersions(string $currentVersion, string $newVersion): int|bool
    {
        return version_compare(strtolower($currentVersion), strtolower($newVersion));
    }

    public function getDbName()
    {
        $result = preg_match(
            '/.*(dbname=(.*));.*/',
            $this->dsn, $matches);
        if ($result === FALSE) {
            throw new RuntimeException('Regular expression matching failed unexpectedly.');
        }
        return $result ? $matches[2] : null;
    }

    public function getDisconnectOthersFromDbSql()
    {
        $dbName = $this->getDbName();
        if (!$dbName) {
            throw new RuntimeException('Can not get database name from DSN.');
        }
        return "SELECT pg_terminate_backend(pg_stat_activity.pid)
                FROM pg_stat_activity
                WHERE pg_stat_activity.datname = '{$dbName}'
                  AND pid <> pg_backend_pid();";
    }

    public function updateVersion(string $newVersion): bool
    {
        $stmt = $this->pdo->prepare('UPDATE app.version SET version = ? WHERE id = ?;');
        $updateVersionResult = $stmt->execute([$newVersion, 1]);
        if (!$updateVersionResult) {
            $this->pdo->rollBack();
            throw new RuntimeException("Can not update version.");
        }
        return true;
    }

    /**
     * @param $i
     * @param $total
     * @return void
     * @link https://stackoverflow.com/a/27147177
     */
    public function displayPercent($i, $total)
    {
        $perc = floor(($i / $total) * 100);
        $left = 100 - $perc;
        $write = sprintf("\033[0G\033[2K[%'={$perc}s%-{$left}s] - $perc%% - $i/$total", "", "");
        fwrite(STDERR, $write);
        usleep(8000);
    }

    public function execScripts(array $scripts = [])
    {
        foreach ($scripts as $i => $script) {
            try {
                $file = $this->baseDir . '/sql' . $script;
                if (file_exists($file)) {
                    $sql = file_get_contents($file);
                    $result = $this->pdo->exec($sql);
                    $this->displayPercent($i + 1, count($scripts));
                } else {
                    throw new RuntimeException("File does not exists {$file}");
                }
            } catch (PDOException|Exception $exception) {
                $this->pdo->rollBack();
                echo $exception->getMessage();
                throw new RuntimeException("Can not execute SQL script {$file}");

            }
            if ($result === false) {
                $this->pdo->rollBack();
                throw new RuntimeException("Can not execute SQL script {$file}");
            }
        }
        return true;
    }

    public function updateDescriptions(array $descriptions, string $version, string $name, string $date)
    {
        $insertStmt = $this->pdo->prepare('INSERT INTO about.versions (version, description, date) VALUES (?,?,?) RETURNING id;');
        $insertAbout = $insertStmt->execute([$version, $name, $date]);
        $id = $insertStmt->fetch(PDO::FETCH_ASSOC)['id'];
        if (!$insertAbout) {
            throw new RuntimeException("Can not insert version into 'about.versions'.");
        }
        $stmt = $this->pdo->prepare('INSERT INTO about.version_description (version_id, description) VALUES (?,?);');
        foreach ($descriptions as $description) {
            $updateVersionResult = $stmt->execute([$id, $description]);
            if (!$updateVersionResult) {
                $this->pdo->rollBack();
                throw new RuntimeException("Can not insert data into 'about.version_description'.");
            }
        }
    }

    public function update(): bool
    {
        $this->fetchVersion();
        $this->pdo->beginTransaction();
        $this->pdo->exec($this->getDisconnectOthersFromDbSql());
        foreach ($this->migrationData as $item) {
            if ($this->compareVersions($this->version, $item['version']) === self::CURRENT_VERSION_IS_LESS) {
                $this->execScripts($item['scripts']);
                $this->updateDescriptions($item['description'], $item['version'], $item['name'], $item['releaseDate']);
                $this->updateVersion($item['version']);
            }
        }
        $this->pdo->commit();
        return true;
    }

    public function createDatabase()
    {
        $this->pdo->beginTransaction();
        $this->execScripts($this->createData['scripts']);
        $this->pdo->commit();
    }
}
