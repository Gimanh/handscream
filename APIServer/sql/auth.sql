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

CREATE TABLE IF NOT EXISTS tv_auth.sessions
(
    id            serial PRIMARY KEY,
    user_id       integer,
    access_token  varchar(500),
    refresh_token varchar(500),
    user_ip       varchar(50),
    time_creation timestamp default now()
);
CREATE UNIQUE INDEX IF NOT EXISTS session_id ON tv_auth.sessions (id);

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
