CREATE TABLE IF NOT EXISTS tasks.goal_lists
(
    id              serial,
    name            varchar not null,
    description     varchar,
    date_creation   timestamp default now(),
    goal_id         int     not null
        constraint fr_list_to_goal
            references tasks.goals (id)
            ON DELETE CASCADE,
    owner           int
        constraint fr_goal_lists_user_id
            references tv_auth.users (id)
            ON DELETE CASCADE,
    history_section int
        constraint fr_goal_lists_history_list
            references tasks.history_list (code)
            ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS goal_lists_id ON tasks.goal_lists (id);
