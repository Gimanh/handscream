<?php

namespace ZXC\Modules\SessionsStorage;

use RuntimeException;
use DateTimeInterface;
use ZXC\Modules\DB\DB;
use ZXC\Native\Modules;
use SessionHandlerInterface;
use ZXC\Modules\SessionsStorage\Exceptions\InvalidHandlerRegistration;

class DatabaseSessionStorage implements SessionHandlerInterface
{
    /**
     * @var null | DB
     */
    protected $db = null;

    protected $dateFormat = DateTimeInterface::ISO8601;

    /**
     * @throws InvalidHandlerRegistration
     */
    public function __construct()
    {
        if (!session_set_save_handler($this)) {
            throw new InvalidHandlerRegistration();
        }

        register_shutdown_function('session_write_close');

        $this->db = Modules::get('db');

        if (!$this->db) {
            throw new RuntimeException('Can not get module DB');
        }

    }

    public function close(): bool
    {
        return true;
    }

    public function destroy($id)
    {
        return !!$this->db->delete('DELETE FROM tv_auth.sessions WHERE session_id = ?;', [$id]);
    }

    public function gc($max_lifetime)
    {
        $old = date($this->dateFormat, time() - $max_lifetime);
        return $this->db->delete('DELETE FROM tv_auth.sessions WHERE time_creation < ?;', [$old]);
    }

    public function open($path, $name): bool
    {
        return true;
    }

    public function read($id)
    {
        $data = $this->db->selectOne('SELECT session_data FROM tv_auth.sessions WHERE session_id = ?', [$id]);
        if ($data) {
            return $data['session_data'];
        }
        return '';
    }

    public function write($id, $data)
    {
        $result = $this->db->insert(
            'INSERT INTO tv_auth.sessions (session_id, session_data, time_creation) VALUES (?,?, ?) 
                    ON CONFLICT(session_id) DO UPDATE SET session_data = EXCLUDED.session_data;',
            [$id, $data, date($this->dateFormat, time())]
        );
        if ($result) {
            return true;
        }
        return false;
    }

    public function __destruct()
    {
        return $this->close();
    }
}
