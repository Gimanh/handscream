CREATE TABLE checklist_item_dg_tmp
(
    id            INTEGER NOT NULL
        PRIMARY KEY AUTOINCREMENT,
    description   TEXT    NOT NULL,
    checked       INTEGER default 0,
    parent_id     INTEGER NOT NULL
        REFERENCES checklist_header (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    date_creation INTEGER NOT NULL,
    order_key     INTEGER,
    date_complete INTEGER
);

INSERT INTO checklist_item_dg_tmp(id, description, checked, parent_id, date_creation, order_key, date_complete)
SELECT id, description, checked, parent_id, date_creation, order_key, date_complete
FROM checklist_item;

DROP TABLE checklist_item;

ALTER TABLE checklist_item_dg_tmp
    RENAME TO checklist_item;

CREATE UNIQUE INDEX checklist_item_id_uindex
    ON checklist_item (id);

