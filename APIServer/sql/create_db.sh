#!/bin/bash

#change vars
host="localhost"
port=5432
dbName="task_view_server"
user="test_user"
password="123456"

sqlFiles=(
    "./auth/auth.sql"
    "./app/auth/default_user_group.sql"
    "./app/auth/app_permissions.sql"
    "./app/tasks/schema_tasks.sql"
    "./app/tasks/history_list.sql"
    "./app/tasks/goals.sql"
    "./app/tasks/goal_lists.sql"
    "./app/tasks/tasks.sql"
 )

db_connection=" postgresql://$user:$password@$host:$port/$dbName"

for file in "${sqlFiles[@]}"
  do
    psql $db_connection -H -f $file
  done
