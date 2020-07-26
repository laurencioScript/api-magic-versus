create table summoner(
  id serial primary key,
  user_name varchar(100),
  summoner_name varchar(100) unique,
  account_id varchar(100) unique
);

create table match(
  id serial primary key,
  create_at date default now(),
  summoners json,
  observation varchar(200)
);


-- create table client_info(
-- id_client_info uuid primary key,
-- cpf_cnpj varchar(20) UNIQUE,
-- type_client varchar(1),
-- name_client varchar(100),
-- corporate_name varchar(100),
-- email varchar(100),
-- observation_description varchar(300),
-- observation_color varchar(30),
-- contact text[]
-- );
