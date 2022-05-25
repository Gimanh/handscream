<?php

namespace App\Modules\About;

use ZXC\Modules\DB\DB;

class AboutStorage
{
    protected ?DB $db;

    public function __construct(DB $DB)
    {
        $this->db = $DB;
    }

    public function fetchVersionsInfo(): array
    {
        $query = 'SELECT v.*, vd.description as item
                  FROM about.versions v
                  LEFT JOIN about.version_description vd on v.id = vd.version_id ORDER BY v.id DESC;';
        $result = $this->db->select($query, []);
        return $this->prepareVersionData($result);
    }

    private function prepareVersionData(array $data)
    {
        $result = [];
        foreach ($data as $datum) {
            if (!isset($result[$datum['version']])) {
                $result[$datum['version']] = [
                    'description' => $datum['description'],
                    'date' => $datum['date'],
                    'items' => [],
                ];
            }
            $result[$datum['version']]['items'][] = $datum['item'];
        }
        return $result;
    }
}
