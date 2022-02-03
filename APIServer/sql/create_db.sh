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
 )

db_connection=" postgresql://$user:$password@$host:$port/$dbName"

for file in "${sqlFiles[@]}"
  do
    psql $db_connection -f $file
  done
