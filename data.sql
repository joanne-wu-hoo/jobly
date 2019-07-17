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
    VALUES ('test', 'test', 112358, 'test', 'test.html'),
        ('google', 'Google', 1, 'test', 'test.html'),
     ('amazon', 'Amazon', 12, 'test', 'test.html'),
     ('apple', 'Apple', 123, 'test', 'test.html'),
     ('altoids', 'Altoids', 500, 'lots of altoids', 'test.html');

