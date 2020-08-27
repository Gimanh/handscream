CREATE TABLE if NOT EXISTS notes(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name text,
    description text,
    content text,
    date_creation INTEGER not null,
    parent INTEGER not null,
    expanded INTEGER default 1,
    owner text
);

create unique index if not exists notes_id_uindex
    on notes (id)
;