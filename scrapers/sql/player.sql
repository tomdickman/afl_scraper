CREATE TABLE player (
  id           VARCHAR(100) PRIMARY KEY,
  givenname    VARCHAR(255),
  familyname   VARCHAR(255),
  birthdate    TIMESTAMPTZ
);
