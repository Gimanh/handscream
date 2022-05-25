<?php


namespace ZXC\Native;


use InvalidArgumentException;


/**
 * @method static void emergency($message, array $context = array());
 * @method static void alert($message, array $context = array());
 * @method static void critical($message, array $context = array());
 * @method static void error($message, array $context = array());
 * @method static void warning($message, array $context = array());
 * @method static void notice($message, array $context = array());
 * @method static void info($message, array $context = array());
 * @method static void debug($message, array $context = array());
 * @method static void log($level, $message, array $context = array());
 * @package ZXC\Native
 */
class Log
{
    /**
     * @param $method
     * @param $args
     * @method __callStatic
     */
    public static function __callStatic($method, $args)
    {
        $logger = Modules::get('Logger');
        if (!$logger) {
            throw new InvalidArgumentException('Logger module is not defined');
        }
        call_user_func_array([$logger, $method], $args);
    }
}
