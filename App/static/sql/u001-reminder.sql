CREATE TABLE if NOT EXISTS reminder(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    item_id INTEGER not null,
    date INTEGER,
    date_creation INTEGER not null,
    owner text
);

create unique index if not exists reminder_id_uindex
    on reminder (id, date )
;