<?php

namespace ZXC\Modules\Mailer;

use ZXC\Traits\Module;
use ZXC\Native\Modules;
use ZXC\Interfaces\IModule;
use InvalidArgumentException;
use ZXC\Modules\Mailer\Tx\SMTP;
use ZXC\Modules\Mailer\Tx\Mailer;
use ZXC\Interfaces\Psr\Log\LoggerInterface;


class Mail extends Mailer implements IModule
{
    use Module;

    protected string $host;

    protected int $port;

    protected string $username;

    protected string $password;

    protected ?string $encryption;

    protected string $fromName;

    protected string $fromEmail;

    public function __construct(LoggerInterface $logger = null)
    {
        $loggerModule = Modules::get('logger');
        if ($loggerModule instanceof LoggerInterface) {
            $logger = $loggerModule;
        }
        parent::__construct($logger);
    }

    public function init(array $options = [])
    {
        $requiredConfig = ["host", "port", "username", "password", "fromName", "fromEmail"];
        foreach ($requiredConfig as $item) {
            if (!isset($options[$item])) {
                throw new InvalidArgumentException("Incorrect config for SMTP. Key $item is required.");
            }
        }
        $this->host = $options['host'];
        $this->port = $options['port'];
        $this->username = $options['username'];
        $this->password = $options['password'];
        $this->encryption = $options['encryption'] ?? null;
        $this->fromName = $options['fromName'];
        $this->fromEmail = $options['fromEmail'];
        $this->setServer($this->host, $this->port, $this->encryption)
            ->setAuth($this->username, $this->password)
            ->setFrom($this->fromName, $this->fromEmail);
    }

    public function getSmtp(): SMTP
    {
        return $this->smtp;
    }
}
