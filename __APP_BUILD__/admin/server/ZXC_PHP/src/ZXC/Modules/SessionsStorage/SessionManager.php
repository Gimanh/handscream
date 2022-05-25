<?php

namespace ZXC\Modules\SessionsStorage;

use ZXC\Traits\Module;
use SessionHandlerInterface;
use ZXC\Interfaces\IModule;

class SessionManager implements IModule
{
    use Module;

    /**
     * @var SessionHandlerInterface | null
     */
    protected $provider = null;

    protected $sessionOptions = [];

    protected $config = [];

    public function init(array $options = [])
    {
        $this->config = $options;
        $this->sessionOptions = $this->config['sessionParams'] ?? [];
        $provider = $this->config['provider'] ?? 'db';
        switch ($provider) {
            case 'db':
                $this->provider = new DatabaseSessionStorage();
                break;
            default:
                $this->provider = new DatabaseSessionStorage();
        }
        session_start($this->sessionOptions);
    }
}
