CREATE TABLE if NOT EXISTS comment(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    item_id INTEGER not null,
    text text,
    date_creation INTEGER not null,
    owner text
);

create unique index if not exists comment_id_uindex
    on comment (id)
;