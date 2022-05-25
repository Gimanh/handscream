<?php

namespace App\Modules\Tags;

class TagItem
{
    public int $id;

    public string $name;

    public string $color;

    public int $owner;

    public function __construct(array $data)
    {
        $this->id = $data['id'];
        $this->name = $data['name'];
        $this->color = $data['color'];
        $this->owner = $data['owner'];
    }
}
