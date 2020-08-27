CREATE TABLE if NOT EXISTS task_label
(
    task_id  INTEGER NOT NULL,
    label_id INTEGER NOT NULL ,
    PRIMARY KEY (task_id, label_id)
);