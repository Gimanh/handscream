<?php

namespace ZXC\Native;

class CallHandler
{

    /**
     * @param $handler
     * @param array $args
     */
    public static function execHandler($handler, array $args = [])
    {
        $class = $handler;
        $method = '__invoke';
        if (is_string($handler)) {
            $data = explode(':', $handler);
            $class = $data[0];
            if (count($data) == 2) {
                $method = $data[1];
            }
        }
        if (is_callable($handler)) {
            return call_user_func_array($handler, $args);
        } else {
            return call_user_func_array([new $class, $method], $args);
        }
    }
}
