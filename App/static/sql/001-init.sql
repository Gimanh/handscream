create table if not exists version(
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	version TEXT default '0.0.1'
);
insert into version (id, version) values (7,'0.0.1');

create table targets
(
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	name text not null,
	description text not null,
	date_creation INTEGER not null,
	parent text,
	owner text
)
;

create unique index targets_id_uindex
	on targets (id)
;

--CHECKLIST COMPONENT DB STRUCTURE
create table checklist_header
(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name text not null,
    description text,
    date_creation INTEGER not null,
    parent INTEGER not null,
    expanded INTEGER default 1,
    owner text
)
;

create unique index checklist_header_id_uindex
    on checklist_header (id)
;

create table checklist_item
(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    description text not null,
    checked INTEGER default 0, --1 - checked, 0 - unchecked
    parent_id INTEGER not null,
    date_creation INTEGER not null,
    FOREIGN KEY(parent_id) REFERENCES checklist_header(id)

)
;

create unique index checklist_item_id_uindex
    on checklist_item (id)
;