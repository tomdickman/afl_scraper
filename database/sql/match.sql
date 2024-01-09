CREATE TABLE IF NOT EXISTS match (
  id           VARCHAR(50) PRIMARY KEY,
  venue        VARCHAR(255),
  hometeam     VARCHAR(100),
  awayteam     VARCHAR(100),
  matchdate    TIMESTAMPTZ,
  FOREIGN KEY (venue) REFERENCES team(id)
  FOREIGN KEY (hometeam) REFERENCES team(id)
  FOREIGN KEY (awayteam) REFERENCES team(id)
);
