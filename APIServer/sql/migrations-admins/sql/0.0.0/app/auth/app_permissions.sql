INSERT INTO tv_auth.permissions (name, description)
VALUES ('add_users', 'Add users');
INSERT INTO tv_auth.permissions (name, description)
VALUES ('block_users', 'Add users');
INSERT INTO tv_auth.permissions (name, description)
VALUES ('change_password', 'Add users');

INSERT INTO tv_auth.roles (name, description)
VALUES ('super_admin', 'Super admin');

INSERT INTO tv_auth.groups (name, description)
VALUES ('super_admin', 'Super admin');

INSERT INTO tv_auth.role_to_permissions (role_id, permission_id)
VALUES ((select id from tv_auth.roles where name = 'super_admin'),
        (select id from tv_auth.permissions where name = 'add_users')),
       ((select id from tv_auth.roles where name = 'super_admin'),
        (select id from tv_auth.permissions where name = 'block_users')),
       ((select id from tv_auth.roles where name = 'super_admin'),
        (select id from tv_auth.permissions where name = 'change_password'));

INSERT INTO tv_auth.group_to_roles (group_id, role_id)
VALUES ((select id from tv_auth.groups where name = 'super_admin'),
        (select id from tv_auth.roles where name = 'super_admin'));

INSERT INTO tv_auth.users (id, login, email, password, block, confirm_email_code, remind_password_code,
                           remember_token)
VALUES (1, 'superadmin', 'superadmin@mail.dest', '$2y$10$q8SLauZ0Syz9aEFdiq0i8.jIlafLj5T0ujXYD7RmRzyNkZ2hR7uhO', 0,
        '40390b741a906a45119390922eaaff1d', null, null);
