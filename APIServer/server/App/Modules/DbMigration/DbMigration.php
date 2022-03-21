<?php

namespace App\Modules\DbMigration;

class DbMigration
{
    const CURRENT_VERSION_IS_LESS = -1;
    const VERSIONS_ARE_EQUAL = 0;
    const CURRENT_VERSION_IS_GREATER = 1;

    public function compareVersions(string $currentVersion, string $newVersion): int|bool
    {
        return version_compare(strtolower($currentVersion), strtolower($newVersion));
    }
}
