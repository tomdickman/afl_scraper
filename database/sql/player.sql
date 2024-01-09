CREATE TABLE IF NOT EXISTS player (
  id           VARCHAR(100) PRIMARY KEY,
  givenname    VARCHAR(255) NOT NULL,
  familyname   VARCHAR(255) NOT NULL,
  birthdate    TIMESTAMPTZ NOT NULL
);
