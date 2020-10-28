DROP TABLE IF EXISTS checklist_header_dg_tmp;
CREATE TABLE checklist_header_dg_tmp
(
    id            INTEGER NOT NULL
        PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    description   TEXT,
    date_creation INTEGER NOT NULL,
    parent        INTEGER NOT NULL
        REFERENCES targets (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    expanded      INTEGER DEFAULT 1,
    owner         TEXT,
    order_key     INTEGER
);

INSERT INTO checklist_header_dg_tmp(id, name, description, date_creation, parent, expanded, owner, order_key)
SELECT id,
       name,
       description,
       date_creation,
       parent,
       expanded,
       owner,
       order_key
FROM checklist_header;

DROP TABLE checklist_header;

ALTER TABLE checklist_header_dg_tmp
    RENAME TO checklist_header;

CREATE UNIQUE INDEX checklist_header_id_uindex
    ON checklist_header (id);

