<?php

namespace ZXC\Modules\Logger;

use DateTime;
use RuntimeException;
use ZXC\Traits\Module;
use ZXC\Native\FromGlobals;
use ZXC\Interfaces\IModule;
use ZXC\Interfaces\Psr\Log\LogLevel;
use ZXC\Interfaces\Psr\Log\AbstractLogger;
use ZXC\Interfaces\Psr\Log\LoggerInterface;

class Logger extends AbstractLogger implements LoggerInterface, IModule
{
    use Module;

    protected string $dateFormat = DateTime::RFC2822;

    protected string $logFileName = '';

    protected string $folder = '';

    protected string $template = "";

    protected string $level = LogLevel::CRITICAL;

    protected string $fullPath;

    /**
     * @var string "day" | "month"
     */
    protected string $mode = "day";

    private array $lvlToValue = [
        LogLevel::EMERGENCY => 0,
        LogLevel::ALERT => 1,
        LogLevel::CRITICAL => 2,
        LogLevel::ERROR => 3,
        LogLevel::WARNING => 4,
        LogLevel::NOTICE => 5,
        LogLevel::INFO => 6,
        LogLevel::DEBUG => 7,
    ];

    public function init(array $options = [])
    {
        $this->level = $options['lvl'] ?? LogLevel::CRITICAL;
        $this->logFileName = $options['fileName'] ?? 'zxc_application';
        $this->folder = $options['folder'] ?? sys_get_temp_dir();
        $this->template = $options['template'] ?? "{date} | {level} | {ip} | {message} | {context}";
        $this->mode = $options['mode'] ?? 'day';
    }

    public function updateLogFullPath()
    {
        if ($this->mode === 'day') {
            $this->logFileName .= date('Ymd') . '.log';
        } else {
            $this->logFileName .= date('Ym') . '.log';
        }

        $this->fullPath = rtrim($this->folder, '/') . '/' . $this->logFileName;

        if (!file_exists($this->fullPath)) {
            $created = touch($this->fullPath);
            if (!$created) {
                throw new RuntimeException('Can not create log file.');
            }
        }
    }

    public function log($level, $message, array $context = []): void
    {
        $this->updateLogFullPath();
        if ($this->lvlToValue[$level] <= $this->lvlToValue[$this->level]) {
            file_put_contents($this->fullPath, trim(strtr($this->template, [
                    '{date}' => $this->getDate(),
                    '{level}' => $level,
                    '{ip}' => FromGlobals::getIp(),
                    '{message}' => $message,
                    '{context}' => $this->contextStringify($context),
                ])) . PHP_EOL, FILE_APPEND);
        }
    }

    public function getDate(): string
    {
        return (new DateTime())->format($this->dateFormat);
    }

    public function contextStringify(array $context = []): bool|string
    {
        return json_encode($context);
    }
}
