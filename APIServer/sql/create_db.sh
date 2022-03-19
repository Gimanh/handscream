#!/bin/bash

#change vars
host="localhost"
port=5432
dbName="task_view_server"
user="test_user"
password="123456"

sqlFiles=(
    "./clean.sql"
    "./auth/auth.sql"
    "./app/auth/trigger_default_user_group.sql"
    "./app/auth/app_permissions.sql"
    "./app/auth/create_tasks_auth.sql"
    "./app/tasks/schema_tasks.sql"
    "./app/tasks/history_list.sql"
    "./app/tasks/goals.sql"
    "./app/tasks/goal_lists.sql"
    "./app/tasks/tasks.sql"
    "./app/auth/user_task_permissions.sql"
    "./app/auth/app_components_permissions.sql"
    "./app/auth/trigger_set_component_permissions.sql"
    "./app/auth/trigger_set_owner_for_component.sql"
    "./app/auth/trigger_set_owner_for_task.sql"
    "./app/auth/app_goal_permissions.sql"
    "./app/auth/trigger_set_goal_permissions.sql"
    "./app/auth/user_goal_permissions.sql"
    "./app/auth/user_component_permissions.sql"
    "./app/auth/trigger_set_task_permissions.sql"
    "./app/about/create_schema.sql"
    "./app/about/about_versions.sql"
    "./app/about/about_version_description.sql"
    "./app/auth/app_task_permissions.sql"
 )

db_connection=" postgresql://$user:$password@$host:$port/$dbName"

for file in "${sqlFiles[@]}"
  do
    psql $db_connection -f $file
  done
