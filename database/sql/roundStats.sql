DROP TABLE roundstats;

CREATE TABLE IF NOT EXISTS roundstats (
  playerid                  VARCHAR(100) NOT NULL,
  game                      INT NOT NULL,
  team                      VARCHAR(50) NOT NULL,
  opponent                  VARCHAR(50) NOT NULL,
  roundnumber               VARCHAR(10) NOT NULL,
  year                      INT NOT NULL,
  result                    VARCHAR(10) NOT NULL,
  jumpernumber              INT NOT NULL,
  kicks                     INT NOT NULL,
  marks                     INT NOT NULL,
  handballs                 INT NOT NULL,
  disposals                 INT NOT NULL,
  goals                     INT NOT NULL,
  behinds                   INT NOT NULL,
  hitouts                   INT NOT NULL,
  tackles                   INT NOT NULL,
  rebound50s                INT NOT NULL,
  inside50s                 INT NOT NULL,
  clearances                INT NOT NULL,
  clangers                  INT NOT NULL,
  freekicksfor              INT NOT NULL,
  freekicksagainst          INT NOT NULL,
  brownlowvotes             INT NOT NULL,
  contestedpossessions      INT NOT NULL,
  uncontestedpossessions    INT NOT NULL,
  contestedmarks            INT NOT NULL,
  marksinside50             INT NOT NULL,
  onepercenters             INT NOT NULL,
  bounces                   INT NOT NULL,
  goalassists               INT NOT NULL,
  timeongroundpercentage    INT NOT NULL,
  fantasypoints             INT NOT NULL,
  PRIMARY KEY (playerid, game),
  FOREIGN KEY (playerid) REFERENCES player(id)
  FOREIGN KEY (team) REFERENCES team(id)
  FOREIGN KEY (opponent) REFERENCES team(id)
);
