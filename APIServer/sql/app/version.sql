create schema if not exists app;
create table if not exists app.version
(
    id           serial,
    version      varchar,
    prev_version varchar
);

insert into app.version(id, version, prev_version)
select 1, '1.0.0', '0.0.0'
where not EXISTS(select id from app.version where id = 1);
