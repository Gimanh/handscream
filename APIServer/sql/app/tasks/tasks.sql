create table tasks.tasks
(
    id              serial UNIQUE,
    parent_id       int       default null
        constraint fr_task_parent_id
            references tasks.tasks (id)
            ON DELETE CASCADE,
    description     varchar,
    complete        bool      default false,
    goal_list_id    int not null
        constraint fr_goal_list_id
            references tasks.goal_lists (id)
            ON DELETE CASCADE,
    date_creation   timestamp default now(),
    owner           int
        constraint fr_task_user_id
            references tv_auth.users (id)
            ON DELETE CASCADE,
    history_section int
        constraint fr_tasks_history_list
            references tasks.history_list (code)
            ON DELETE SET NULL,
    responsible_id  int
        constraint fr_task_responsible_id
            references tv_auth.users (id)
            ON DELETE SET NULL,
    deadline        timestamp,
    date_complete   timestamp,
    note            varchar
);
