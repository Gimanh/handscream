CREATE TABLE if NOT EXISTS time_record
(
    id    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    task_id  INTEGER,
    date_creation INTEGER,
    date_start INTEGER,
    date_end INTEGER
);

create unique index if not exists time_record_id_uindex
    on time_record (id)
;