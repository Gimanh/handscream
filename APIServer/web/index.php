<?php

use ZXC\ZXCFactory;

require __DIR__ . '/../vendor/autoload.php';

$appConfig = __DIR__ . '/../config/config.json';

ZXCFactory::create($appConfig);
