CREATE SCHEMA IF NOT EXISTS tv_auth;
CREATE TABLE IF NOT EXISTS tv_auth.users
(
    id                   serial PRIMARY KEY,
    login                varchar(50),
    email                varchar(50),
    password             varchar(256),
    block                integer default 0,
    confirm_email_code   varchar(256),
    remind_password_code varchar(256),
    remember_token       varchar(256)
);
CREATE UNIQUE INDEX IF NOT EXISTS users_id ON tv_auth.users (id);
CREATE UNIQUE INDEX IF NOT EXISTS users_email ON tv_auth.users (email);
CREATE UNIQUE INDEX IF NOT EXISTS users_login ON tv_auth.users (login);

CREATE TABLE IF NOT EXISTS tv_auth.user_tokens
(
    id            serial PRIMARY KEY,
    user_id       integer
        constraint fr_user_id_user_tokens
            references tv_auth.users (id)
            on delete cascade,
    access_token  varchar,
    refresh_token varchar,
    user_ip       varchar(50),
    time_creation timestamp default now()
);
CREATE UNIQUE INDEX IF NOT EXISTS user_tokens_id ON tv_auth.user_tokens (id);

CREATE TABLE IF NOT EXISTS tv_auth.sessions
(
    id            serial PRIMARY KEY,
    user_id       integer
        constraint fr_user_id_sessions
            references tv_auth.users (id)
            on delete cascade,
    session_id    varchar(32),
    session_data  varchar,
    user_ip       varchar(50),
    time_creation timestamp default now()
);
CREATE UNIQUE INDEX IF NOT EXISTS session_id ON tv_auth.sessions (id);
CREATE UNIQUE INDEX IF NOT EXISTS session_session_id ON tv_auth.sessions (session_id);

CREATE TABLE IF NOT EXISTS tv_auth.permissions
(
    id          serial PRIMARY KEY,
    name        varchar(50),
    description varchar(100)
);
CREATE UNIQUE INDEX IF NOT EXISTS permissions_id ON tv_auth.permissions (id);

CREATE TABLE IF NOT EXISTS tv_auth.roles
(
    id          serial PRIMARY KEY,
    name        varchar(50),
    description varchar(100)
);
CREATE UNIQUE INDEX IF NOT EXISTS role_id ON tv_auth.roles (id);

CREATE TABLE IF NOT EXISTS tv_auth.groups
(
    id          serial PRIMARY KEY,
    name        varchar(50),
    description varchar(100)
);
CREATE UNIQUE INDEX IF NOT EXISTS group_id ON tv_auth.groups (id);

CREATE TABLE IF NOT EXISTS tv_auth.group_to_roles
(
    group_id int
        constraint fr_group_id_group_to_roles
            references tv_auth.groups (id)
            on delete cascade,
    role_id  int
        constraint fr_role_id_group_to_roles
            references tv_auth.roles
            on delete cascade,
    PRIMARY KEY (group_id, role_id)
);

CREATE TABLE IF NOT EXISTS tv_auth.role_to_permissions
(
    role_id       int
        constraint fr_role_id_role_to_permissions
            references tv_auth.roles (id)
            on delete cascade,
    permission_id int
        constraint fr_permission_id_role_to_permissions
            references tv_auth.permissions
            on delete cascade,
    PRIMARY KEY (permission_id, role_id)
);


CREATE TABLE IF NOT EXISTS tv_auth.user_to_groups
(
    user_id  int
        constraint fk_user_to_groups_users_id
            references tv_auth.users (id)
            on delete cascade,
    group_id int
        constraint user_to_groups_groups_id_fk
            references tv_auth.groups (id)
            on delete cascade,
    PRIMARY KEY (user_id, group_id)


);


--FIXME test data start
INSERT INTO tv_auth.permissions (id, name, description)
VALUES (1, 'read', 'Read'),
       (2, 'edit', 'Edit'),
       (3, 'delete', 'Delete'),
       (4, 'create', 'Create'),
       (5, 'block_users', 'Block users');

INSERT INTO tv_auth.roles (id, name, description)
VALUES (1, 'user', 'User'),
       (2, 'moderator', 'Moderator'),
       (3, 'writer', 'Writer'),
       (4, 'guest', 'Guest');

INSERT INTO tv_auth.groups (id, name, description)
VALUES (1, 'users', 'App users'),
       (2, 'stuff', 'App stuff'),
       (3, 'guest', 'Guest');

INSERT INTO tv_auth.role_to_permissions (role_id, permission_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),
       (2, 3),
       (2, 5),
       (3, 1),
       (3, 2),
       (3, 3),
       (3, 4),
       (4, 1);
INSERT INTO tv_auth.group_to_roles (group_id, role_id)
VALUES (1, 1),
       (2, 1),
       (2, 2),
       (3, 4);

INSERT INTO tv_auth.users (id, login, email, password, block, confirm_email_code, remind_password_code, remember_token)
VALUES (1, 'user', 'test@mail.dest', '$2y$10$q8SLauZ0Syz9aEFdiq0i8.jIlafLj5T0ujXYD7RmRzyNkZ2hR7uhO', 0,
        '40390b741a906a45119390922eaaff1d', null, null);

INSERT INTO tv_auth.user_to_groups (user_id, group_id)
VALUES (1, 1);
--FIXME test data end
