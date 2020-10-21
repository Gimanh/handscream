CREATE TABLE time_record_dg_tmp
(
    id            INTEGER NOT NULL
        PRIMARY KEY AUTOINCREMENT,
    task_id       INTEGER
        REFERENCES checklist_item (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    date_creation INTEGER,
    date_start    INTEGER,
    date_end      INTEGER
);

INSERT INTO time_record_dg_tmp(id, task_id, date_creation, date_start, date_end)
SELECT id, task_id, date_creation, date_start, date_end
FROM time_record;

DROP TABLE time_record;

ALTER TABLE time_record_dg_tmp
    RENAME TO time_record;

CREATE UNIQUE INDEX time_record_id_uindex
    ON time_record (id);

