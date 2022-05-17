<?php

namespace App\Modules\Tasks\Args;

use ZXC\Modules\Auth\Auth;
use ZXC\Modules\Auth\User;
use ZXC\Native\Modules;

class FetchTasksArg
{
    protected ?int $componentId = null;

    protected ?int $page = null;

    protected ?int $showCompleted = null;

    protected ?string $searchText = null;

    protected int $limit = 20;

    protected ?Auth $auth = null;

    protected ?User $user = null;

    protected array $args = [];

    protected string $query = '';

    public function __construct(array $fetchTaskParams, int $limit)
    {
        $this->limit = $limit;
        $this->componentId = (int)$fetchTaskParams['componentId'];
        $this->page = (int)$fetchTaskParams['page'];
        $this->showCompleted = (int)$fetchTaskParams['showCompleted'];
        $this->searchText = trim($fetchTaskParams['searchText']);
        $this->auth = Modules::get('auth');
        $this->user = $this->auth->getUser();
        $this->prepareQueryData();
    }

    protected function getOffset(): int
    {
        if ($this->page > 0) {
            return $this->page * $this->limit;
        }
        return $this->page;
    }

    private function prepareQueryData(): void
    {
        $this->args = [
            $this->componentId,
            $this->user->getId(),
            $this->showCompleted,
            $this->getOffset(),
            $this->limit
        ];
        $this->query = 'select distinct on (t.id) t.*
                                                from tasks.tasks t
                                                         left join tasks_auth.user_task_permissions utp on t.id = utp.task_id
                                                where t.goal_list_id = ?
                                                  and utp.user_id = ?
                                                  and parent_id is null
                                                  and complete = ?
                                                order by t.id desc
                                                offset ? limit ?;';
        if ($this->searchText) {
            $this->query = 'select distinct on (t.id) t.*
                                                from tasks.tasks t
                                                         left join tasks_auth.user_task_permissions utp on t.id = utp.task_id
                                                where t.goal_list_id = ?
                                                  and utp.user_id = ?
                                                  and parent_id is null
                                                  and complete = ?
                                                  and lower(t.description) like lower(\'%\'||?||\'%\')
                                                order by t.id desc
                                                offset ? limit ?;';
            $this->args = [
                $this->componentId,
                $this->user->getId(),
                $this->showCompleted,
                mb_strtolower($this->searchText, 'UTF-8'),
                $this->getOffset(),
                $this->limit
            ];
        }
    }

    /**
     * @return array
     */
    public function getArgs(): array
    {
        return $this->args;
    }

    /**
     * @return string
     */
    public function getQuery(): string
    {
        return $this->query;
    }
}
