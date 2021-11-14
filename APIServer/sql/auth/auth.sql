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
    user_id       integer,
    access_token  varchar(500),
    refresh_token varchar(500),
    user_ip       varchar(50),
    time_creation timestamp default now()
);
CREATE UNIQUE INDEX IF NOT EXISTS user_tokens_id ON tv_auth.user_tokens (id);

CREATE TABLE IF NOT EXISTS tv_auth.sessions
(
    id            serial PRIMARY KEY,
    user_id       integer,
    session_id    varchar(32),
    session_data  varchar(500),
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
    group_id int,
    role_id  int,
    PRIMARY KEY (group_id, role_id)
);

CREATE TABLE IF NOT EXISTS tv_auth.role_to_permissions
(
    role_id       int,
    permission_id int,
    PRIMARY KEY (permission_id, role_id)
);


CREATE TABLE IF NOT EXISTS tv_auth.user_to_groups
(
    user_id  int,
    group_id int,
    PRIMARY KEY (user_id, group_id)
);


alter table tv_auth.user_to_groups
    add constraint user_to_groups_groups_id_fk
        foreign key (group_id) references tv_auth.groups
            on delete cascade;

alter table tv_auth.user_to_groups
    add constraint user_to_groups_users_id_fk
        foreign key (user_id) references tv_auth.users
            on delete cascade;

alter table tv_auth.user_tokens
    add constraint user_tokens_user_id_fk
        foreign key (user_id) references tv_auth.users
            on delete cascade;

alter table tv_auth.sessions
    add constraint sessions_user_id_fk
        foreign key (user_id) references tv_auth.users
            on delete cascade;

alter table tv_auth.role_to_permissions
    add constraint role_to_permissions_role_id_fk
        foreign key (role_id) references tv_auth.roles
            on delete cascade;

alter table tv_auth.role_to_permissions
    add constraint role_to_permissions_permission_id_fk
        foreign key (permission_id) references tv_auth.permissions
            on delete cascade;

alter table tv_auth.group_to_roles
    add constraint group_to_roles_group_id_fk
        foreign key (group_id) references tv_auth.groups
            on delete cascade;

alter table tv_auth.group_to_roles
    add constraint group_to_roles_role_id_fk
        foreign key (role_id) references tv_auth.roles
            on delete cascade;

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
