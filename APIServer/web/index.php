<?php

use ZXC\ZXCConfig;
use ZXC\ZXCFactory;

require dirname(__FILE__) . '/../vendor/autoload.php';

ZXCFactory::create(ZXCConfig::create(dirname(__FILE__) . '/../config/'));
