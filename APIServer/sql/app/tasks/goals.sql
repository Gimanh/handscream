CREATE TABLE IF NOT EXISTS tasks.goals
(
    id              serial,
    name            varchar,
    description     varchar,
    color           varchar,
    date_creation   timestamp default now(),
    owner           int
        constraint fr_goals_user_id
            references tv_auth.users (id)
            ON DELETE CASCADE,
    history_section int
        constraint fr_goals_history_list
            references tasks.history_list (code)
            ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS goals_id ON tasks.goals (id);
