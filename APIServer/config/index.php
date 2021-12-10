<?php
$moduleDirectories = array_filter(glob(__DIR__ . '/*'), 'is_dir');
$appConfig = json_decode(file_get_contents(__DIR__ . '/app-config-template.json'), true);
$middlewares = json_decode(file_get_contents(__DIR__ . '/app-middlewares.json'), true);
$appConfig['router'] = array_merge($appConfig['router'], $middlewares);
foreach ($moduleDirectories as $moduleDirectory) {
    $moduleName = pathinfo($moduleDirectory, PATHINFO_FILENAME);
    $appConfig['modules'][$moduleName] = json_decode(file_get_contents($moduleDirectory . '/options.json'), true);
    $routesFilePath = $moduleDirectory . '/routes.json';
    if (file_exists($routesFilePath)) {
        $routes = json_decode(file_get_contents($routesFilePath), true);
        $appConfig['router']['routes'] = array_merge($appConfig['router']['routes'], $routes);
    }
}
return $appConfig;
