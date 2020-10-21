CREATE TABLE comment_dg_tmp
(
    id            INTEGER NOT NULL
        PRIMARY KEY AUTOINCREMENT,
    item_id       INTEGER NOT NULL
        REFERENCES checklist_item (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    text          TEXT,
    date_creation INTEGER NOT NULL,
    owner         TEXT
);

INSERT INTO comment_dg_tmp(id, item_id, text, date_creation, owner)
SELECT id, item_id, text, date_creation, owner
FROM comment;

DROP TABLE comment;

ALTER TABLE comment_dg_tmp
    RENAME TO comment;

CREATE UNIQUE INDEX comment_id_uindex
    ON comment (id);

