\c jobly
-- \c jobly-test

DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;

CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees integer CHECK (num_employees >= 0),
    description text NOT NULL,
    logo_url text NOT NULL
);

CREATE TABLE jobs (
    id serial PRIMARY KEY,
    title text NOT NULL,
    salary float NOT NULL,
    equity float NOT NULL CHECK (equity <= 1 AND equity >= 0),
    company_handle text NOT NULL REFERENCES companies ON DELETE CASCADE,
    date_posted date DEFAULT CURRENT_DATE NOT NULL
);

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    photo_url text NOT NULL,
    is_admin boolean DEFAULT false NOT NULL 
);


INSERT INTO companies
    VALUES ('test', 'test', 112358, 'test', 'test.html'),
           ('google', 'Google', 1, 'test', 'test.html'),
           ('amazon', 'Amazon', 12, 'test', 'test.html'),
           ('apple', 'Apple', 123, 'test', 'test.html'),
           ('altoids', 'Altoids', 500, 'lots of altoids', 'test.html');

