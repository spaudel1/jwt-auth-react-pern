CREATE DATABASE jwttoturial;
-- set extension 
-- create extension if not exists "uuid-ossp";


CREATE table users (
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL
)