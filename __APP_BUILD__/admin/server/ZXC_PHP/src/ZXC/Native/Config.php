<?php


namespace ZXC\Native;


class Config
{
    private static $config = [];

    public static function init(array $config = []): void
    {
        self::$config = $config;
    }

    public static function get(string $pathToConfigParams, $registry = true)
    {
        $lastSlash = substr($pathToConfigParams, -1);
        if ($lastSlash === '/') {
            $pathToConfigParams = rtrim($pathToConfigParams, '/');
        }

        if (!$registry) {
            $pathToConfigParams = strtolower($pathToConfigParams);
        }

        $path = explode('/', $pathToConfigParams);
        if ($registry) {
            $configParameters = self::$config;
        } else {
            $configParameters = self::keysToLower(self::$config);
        }
        foreach ($path as $item) {
            if (is_array($configParameters) && array_key_exists($item, $configParameters)) {
                $configParameters = $configParameters[$item];
            } else {
                return null;
            }
        }
        return $configParameters;
    }

    public static function add(array $moreConfig = []): void
    {
        self::$config = array_merge_recursive(self::$config, $moreConfig);
    }

    private static function keysToLower(array $input = []): array
    {
        $result = [];
        foreach ($input as $key => $value) {
            $key = strtolower($key);

            if (is_array($value)) {
                $value = self::keysToLower($value);
            }

            $result[$key] = $value;
        }
        return $result;
    }
}
