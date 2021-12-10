<?php

use ZXC\ZXCFactory;

require dirname(__FILE__) . '/../vendor/autoload.php';

$appConfig = require dirname(__FILE__) . '/../config/index.php';

ZXCFactory::create($appConfig);
