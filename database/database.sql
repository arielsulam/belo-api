CREATE DATABASE beloapi;
 
 CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    instId TEXT,
    side TEXT,
    quantity NUMERIC,
    price NUMERIC,
    timestamp BIGINT
);

INSERT INTO users (name, email) VALUES
    ('Joe', 'joe@ibm.com'),
    ('ryan', 'ryan@fastweb.com');


 