CREATE DATABASE moviesdb WITH ENCODING='UTF8';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET timezone = 'America/Bogota';

CREATE TABLE movies(
    id UUID DEFAULT uuid_generate_v4(),
    title VARCHAR(255) UNIQUE NOT NULL,
    language VARCHAR(255) NOT NULL,
    rating VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    release_date VARCHAR(255) NOT NULL,
    trailer VARCHAR(255) UNIQUE NOT NULL,
    sinopsis TEXT NOT NULL,
    director VARCHAR(255) NOT NULL,
    casting TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    poster_id TEXT NOT NULL,
    created_at	TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(id)
);