<?php


use PHPUnit\Framework\TestCase;
use ZXC\Interfaces\Psr\Log\LogLevel;
use ZXC\Native\Log;
use ZXC\Native\Modules;

class LogTest extends TestCase
{
    public $logFileName = 'test_log_file_zxc.log';

    public $filePath = '';

    public function __construct(?string $name = null, array $data = [], $dataName = '')
    {
        $this->filePath = __DIR__ . DIRECTORY_SEPARATOR . $this->logFileName;
        parent::__construct($name, $data, $dataName);
    }

    protected function tearDown(): void
    {
        if (file_exists($this->filePath)) {
            unlink($this->filePath);
        }
    }

    public function setUp(): void
    {
        Modules::install([
            "Logger" => [
                "class" => "ZXC\\Modules\\Logger\\Logger",
                "defer" => true,
                "options" => [
                    "lvl" => "debug",
                    "fileName" => $this->logFileName,
                    "folder" => __DIR__
                ]
            ]
        ]);
    }

    public function testLogDebug()
    {
        $message = 'Message debug';
        Log::debug($message, ['prop' => 'value']);
        $content = file_get_contents($this->filePath);
        $this->assertTrue($this->contentIssetMessage($content, $message, LogLevel::DEBUG));
    }

    public function testLogEmergency()
    {
        $message = 'Message emergency';
        Log::emergency($message, ['prop' => 'value']);
        $content = file_get_contents($this->filePath);
        $this->assertTrue($this->contentIssetMessage($content, $message, LogLevel::EMERGENCY));
    }

    public function testLogAlert()
    {
        $message = 'Message alert';
        Log::alert($message, ['prop' => 'value']);
        $content = file_get_contents($this->filePath);
        $this->assertTrue($this->contentIssetMessage($content, $message, LogLevel::ALERT));
    }

    public function testLogCritical()
    {
        $message = 'Message critical';
        Log::critical($message, ['prop' => 'value']);
        $content = file_get_contents($this->filePath);
        $this->assertTrue($this->contentIssetMessage($content, $message, LogLevel::CRITICAL));
    }

    public function testLogError()
    {
        $message = 'Message error';
        Log::error($message, ['prop' => 'value']);
        $content = file_get_contents($this->filePath);
        $this->assertTrue($this->contentIssetMessage($content, $message, LogLevel::ERROR));
    }

    public function testLogWarning()
    {
        $message = 'Message warning';
        Log::warning($message, ['prop' => 'value']);
        $content = file_get_contents($this->filePath);
        $this->assertTrue($this->contentIssetMessage($content, $message, LogLevel::WARNING));
    }

    public function testLogNotice()
    {
        $message = 'Message notice';
        Log::notice($message, ['prop' => 'value']);
        $content = file_get_contents($this->filePath);
        $this->assertTrue($this->contentIssetMessage($content, $message, LogLevel::NOTICE));
    }

    public function testLogInfo()
    {
        $message = 'Message info';
        Log::info($message, ['prop' => 'value']);
        $content = file_get_contents($this->filePath);
        $this->assertTrue($this->contentIssetMessage($content, $message, LogLevel::INFO));
    }

    public function contentIssetMessage($content, $message, $lvl)
    {
        $content = explode('|', $content);
        return trim($content[3]) === trim($message) && trim($content[1]) === trim($lvl);
    }
}
