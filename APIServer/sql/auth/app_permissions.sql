INSERT INTO tv_auth.permissions (id, name, description)
VALUES (1, 'app_access', 'Access to the app'),
       (2, 'create_goals', 'Create goals in own account'),
       (3, 'edit_goals', 'Edit goals in own account'),
       (4, 'delete_goals', 'Delete goals in own account'),
       (5, 'create_components', 'Create components in own account'),
       (6, 'edit_components', 'Edit components in own account'),
       (7, 'delete_components', 'Delete components in own account'),
       (8, 'create_tasks', 'Create tasks in own account'),
       (9, 'edit_tasks', 'Edit tasks in own account'),
       (10, 'delete_tasks', 'Delete tasks in own account');

INSERT INTO tv_auth.roles (id, name, description)
VALUES (1, 'app_user', 'User');

INSERT INTO tv_auth.groups (id, name, description)
VALUES (1, 'app_users', 'App users');

INSERT INTO tv_auth.role_to_permissions (role_id, permission_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),
       (1, 5),
       (1, 6),
       (1, 7),
       (1, 8),
       (1, 9),
       (1, 10);

INSERT INTO tv_auth.group_to_roles (group_id, role_id)
VALUES (1, 1);

INSERT INTO tv_auth.users (id, login, email, password, block, confirm_email_code, remind_password_code, remember_token)
VALUES (1, 'user', 'test@mail.dest', '$2y$10$q8SLauZ0Syz9aEFdiq0i8.jIlafLj5T0ujXYD7RmRzyNkZ2hR7uhO', 0,
        '40390b741a906a45119390922eaaff1d', null, null);


