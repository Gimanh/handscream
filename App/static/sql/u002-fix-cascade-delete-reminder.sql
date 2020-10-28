DROP TABLE IF EXISTS reminder_dg_tmp;
CREATE TABLE reminder_dg_tmp
(
    id            INTEGER NOT NULL
        primary key autoincrement,
    item_id       INTEGER NOT NULL
        REFERENCES checklist_item (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    date          INTEGER,
    date_creation INTEGER NOT NULL,
    owner         TEXT
);

INSERT INTO reminder_dg_tmp(id, item_id, date, date_creation, owner)
SELECT id, item_id, date, date_creation, owner
FROM reminder;

DROP TABLE reminder;

ALTER TABLE reminder_dg_tmp
    RENAME TO reminder;

