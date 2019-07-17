\c jobly

DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees integer CHECK (num_employees >= 0),
    description text,
    logo_url text
);

INSERT INTO companies
    VALUES ('test', 'test', 112358, 'test', 'test.html')
