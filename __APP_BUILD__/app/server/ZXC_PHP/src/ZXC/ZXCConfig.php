<?php

namespace ZXC;

class ZXCConfig
{
    protected static function parseDirectory(string $directory): array
    {
        $directory = realpath($directory);
        $moduleDirectories = array_filter(glob($directory . '/*'), 'is_dir');
        $appConfig = json_decode(file_get_contents($directory . '/app-config-template.json'), true);
        $middlewares = json_decode(file_get_contents($directory . '/app-middlewares.json'), true);
        $appConfig['router'] = array_merge($appConfig['router'], $middlewares);
        foreach ($moduleDirectories as $moduleDirectory) {
            $moduleName = pathinfo($moduleDirectory, PATHINFO_FILENAME);
            $appConfig['modules'][$moduleName] = json_decode(file_get_contents($moduleDirectory . '/options.json'), true);
            $routesFilePath = $moduleDirectory . '/routes.json';
            if (file_exists($routesFilePath)) {
                $routes = json_decode(file_get_contents($routesFilePath), true);
                $appConfig['router']['routes'] = array_merge($appConfig['router']['routes'], $routes);
            }
            $moduleMiddlewareFile = $moduleDirectory . '/middlewares.json';
            if(file_exists($moduleMiddlewareFile)){
                $moduleMiddlewares = json_decode(file_get_contents($moduleMiddlewareFile), true);
                if($moduleMiddlewares){
                    $appConfig['router']['middlewares'] = array_merge($appConfig['router']['middlewares'], $moduleMiddlewares);
                }

            }
        }
        return $appConfig;
    }

    public static function create(array|string $config): array
    {
        if (is_array($config)) {
            return $config;
        }
        if (is_string($config)) {
            if (file_exists($config)) {
                return self::parseDirectory($config);
            }
        }
        return [];
    }
}
