drop table if exists teams CASCADE;
drop table if exists players CASCADE;

CREATE TABLE teams (
  id serial primary key,
  team_name varchar(128) not null,
  city varchar(128) not null,
  created_at timestamp not null default current_timestamp
);


CREATE TABLE players (
  id serial primary key,
  full_name varchar(128) not null,
  jersey_number varchar(128) not null,
  active boolean not null,
  team_id integer REFERENCES teams (id),
  created_at timestamp not null default current_timestamp
);


INSERT INTO teams (team_name, city)
VALUES
('Lakers','Los Angeles');


INSERT INTO players (full_name, jersey_number, active, team_id)
VALUES
('LeBron James', 23, true, 1),
('Anthony Davis', 6, true, 1),
('Danny Green', 33, true, 1);
