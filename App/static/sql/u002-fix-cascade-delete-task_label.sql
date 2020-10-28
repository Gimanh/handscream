DROP TABLE IF EXISTS task_label_dg_tmp;
CREATE TABLE task_label_dg_tmp
(
    task_id  INTEGER NOT NULL
        REFERENCES checklist_item (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    label_id INTEGER NOT NULL
        REFERENCES labels
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    PRIMARY KEY (task_id, label_id)
);

INSERT INTO task_label_dg_tmp(task_id, label_id)
SELECT task_id, label_id
FROM task_label;

DROP TABLE task_label;

ALTER TABLE task_label_dg_tmp
    RENAME TO task_label;

