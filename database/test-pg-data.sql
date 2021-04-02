
 drop table if exists teams CASCADE;
drop table if exists players CASCADE;

 CREATE TABLE teams (
  id serial primary key,
  city varchar(128) not null,
  name varchar(128) not null,
  created_at timestamp not null default current_timestamp
);

CREATE TABLE people (
  id serial primary key,
  first_name varchar(128) not null,
  last_name varchar(128) not null,
  created_at timestamp not null default current_timestamp
);


CREATE TABLE players (
  id serial primary key,
  person_id integer REFERENCES people (id),
  active boolean not null,
  created_at timestamp not null default current_timestamp
);

CREATE TABLE players_teams (
  player_id integer REFERENCES players (id),
  team_id integer REFERENCES teams (id),
  jersey_number varchar(128) not null,
  start_date timestamp not null default current_timestamp,
  end_date timestamp default current_timestamp
);


INSERT INTO teams (name, city)
VALUES
('Lakers','Los Angeles'),
('Pelicans','New Orleans');

INSERT INTO people (first_name, last_name)
VALUES
('LeBron', 'James'),
('Anthony', 'Davis'),
('Danny', 'Green'),
('Zion', 'Williamson');


INSERT INTO players (person_id, active)
VALUES
(1, true),
(2, true),
(3, true),
(4, true);

INSERT INTO players_teams (player_id, team_id, jersey_number)
VALUES
(1, 1, 23),
(2, 1, 6),
(3, 1, 33),
(4, 2, 69);



