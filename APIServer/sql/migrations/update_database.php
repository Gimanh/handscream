<?php

use ZXC\ZXCConfig;
use ZXC\ZXCFactory;
use ZXC\Native\Modules;
use App\Modules\DbMigration\DbMigration;

require dirname(__FILE__) . '/../../vendor/autoload.php';

$config = ZXCConfig::create(dirname(__FILE__) . '/../../config/');
ZXCFactory::create($config);

/** @var DbMigration $migration */
$migration = Modules::get('DbMigration');
$updateData = json_decode(file_get_contents(dirname(__FILE__) . '/migrate.json'), true);
echo $migration->update($updateData, dirname(__FILE__).'/sql', $config['modules']['DB']['options']['dsn']);
