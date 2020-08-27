CREATE TABLE if NOT EXISTS labels
(
    id    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name  text UNIQUE,
    color text,
    date_creation INTEGER
);

create unique index if not exists labels_id_uindex
    on labels (id)
;