CREATE TABLE if NOT EXISTS settings
(
    id    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name  text,
    value text
);

create unique index if not exists settings_id_uindex
    on settings (id)
;