<?php

namespace App\Modules\Tags;

use App\Traits\AppDB;
use PDO;
use ZXC\Modules\Auth\User;

class TagStorage
{
    use AppDB;

    protected ?User $user = null;

    public function __construct(?User $user = null)
    {
        $this->user = $user;
        $this->initDatabase();
    }

    public function fetchTagById(int $id): ?TagItem
    {
        $data = $this->db->select('select * from tasks.tags where id = ?;', [$id]);
        if ($data) {
            return new TagItem($data[0]);
        }
        return null;
    }

    public function addTag(string $name, string $color): ?TagItem
    {
        $stmt = $this->db->insert(
            'insert into tasks.tags (name, color, owner) values (?, ?, ?) returning id;',
            [$name, $color, $this->user->getId()],
            true
        );
        if ($stmt) {
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if ($result) {
                return $this->fetchTagById($result[0]['id']);
            }
        }
        return null;
    }

    public function fetchAll(int $userId): ?array
    {
        return $this->db->select('select * from tasks.tags where owner = ?', [$userId]);
    }

    public function tagExists(int $tagId, int $taskId): bool
    {
        return !!$this->db->select('select * from tasks.tasks_to_tags where tag_id = ? and task_id = ?;', [$tagId, $taskId]);
    }

    public function deleteTagFromTask(int $tagId, int $taskId): bool
    {
        return $this->db->delete('delete from tasks.tasks_to_tags where tag_id = ? and task_id = ?', [$tagId, $taskId]);
    }

    public function addTagToTask(int $tagId, int $taskId): bool
    {
        return $this->db->insert('insert into tasks.tasks_to_tags (tag_id, task_id ) values (?,?)', [$tagId, $taskId]);
    }

    public function deleteTag(int $tagId): bool
    {
        return $this->db->delete('delete from tasks.tags where id = ? and owner = ?;', [$tagId, $this->user->getId()]);
    }

    public function updateTag(int $id, string $name, string $color): ?TagItem
    {
        $result = $this->db->update([
            'table' => 'tasks.tags',
            'data' => [
                'name' => trim($name),
                'color' => trim($color)
            ],
            'where' => [
                'id' => $id,
            ]
        ]);
        if ($result) {
            return $this->fetchTagById($id);
        }
        return null;
    }
}
