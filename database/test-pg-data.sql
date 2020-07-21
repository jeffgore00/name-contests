drop table if exists teams CASCADE;
drop table if exists players CASCADE;

CREATE TABLE teams (
  id serial primary key,
  city varchar(128) not null,
  name varchar(128) not null,
  created_at timestamp not null default current_timestamp
);


CREATE TABLE players (
  id serial primary key,
  first_name varchar(128) not null,
  last_name varchar(128) not null,
  jersey_number varchar(128) not null,
  active boolean not null,
  team_id integer REFERENCES teams (id),
  created_at timestamp not null default current_timestamp
);


INSERT INTO teams (name, city)
VALUES
('Lakers','Los Angeles'),
('Pelicans','New Orleans');


INSERT INTO players (first_name, last_name, jersey_number, active, team_id)
VALUES
('LeBron', 'James', 23, true, 1),
('Anthony', 'Davis', 6, true, 1),
('Danny', 'Green', 33, true, 1),
('Zion', 'Williamson', 69, true, 2);
