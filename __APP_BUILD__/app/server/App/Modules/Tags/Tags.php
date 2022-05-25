<?php

namespace App\Modules\Tags;

use ZXC\Modules\Auth\Auth;
use ZXC\Modules\Auth\User;
use ZXC\Native\Modules;
use ZXC\Traits\Module;
use ZXC\Interfaces\IModule;

class Tags implements IModule
{
    use Module;

    protected array $config = [];

    protected ?Auth $auth = null;

    protected ?TagStorage $storage = null;

    protected ?User $user = null;

    public function init(array $options = [])
    {
        $this->config = $options;
        $this->auth = Modules::get('auth');
        $this->user = $this->auth->getUser();
        $this->storage = new TagStorage($this->user);
    }

    public function addTag(string $name, string $color): ?TagItem
    {
        return $this->storage->addTag($name, $color);
    }

    public function updateTag(int $id, string $name, string $color): ?TagItem
    {
        return $this->storage->updateTag($id, $name, $color);
    }

    public function fetchAll(int $userId): ?array
    {
        return $this->storage->fetchAll($userId);
    }

    public function toggleTag(int $tagId, int $taskId)
    {
        if ($this->storage->tagExists($tagId, $taskId)) {
            $this->storage->deleteTagFromTask($tagId, $taskId);
            return 'delete';
        } else {
            $this->storage->addTagToTask($tagId, $taskId);
            return 'add';
        }
    }

    public function deleteTag(int $tagId): bool
    {
        return $this->storage->deleteTag($tagId);
    }
}
