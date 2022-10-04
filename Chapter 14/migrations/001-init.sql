--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE Family (
  id   INTEGER PRIMARY KEY,
  name TEXT    NOT NULL
);

CREATE TABLE Person (
  id          INTEGER PRIMARY KEY,
  familyId    INTEGER NOT NULL,
  name        TEXT    NOT NULL,
  nick        TEXT,
  FOREIGN KEY(familyId) REFERENCES Family(id)
);

CREATE INDEX Person_ix_familyId ON Person (familyId);

CREATE TABLE Friend (
  personId    INTEGER NOT NULL,
  friendId    INTEGER NOT NULL,
  isTheBest   NUMERIC NOT NULL DEFAULT 0,
  PRIMARY KEY (personId, friendId),
  CONSTRAINT Friend_ck_isTheBest CHECK (isTheBest IN (0, 1))
);

INSERT INTO Family (id, name) VALUES (1, 'Foo');
INSERT INTO Family (id, name) VALUES (2, 'Bar');
INSERT INTO Family (id, name) VALUES (3, 'Baz');

INSERT INTO Person (id, familyId, name, nick) VALUES (1, 1, 'John', NULL);
INSERT INTO Person (id, familyId, name, nick) VALUES (2, 1, 'Jakie', NULL);
INSERT INTO Person (id, familyId, name, nick) VALUES (3, 1, 'Jessie', 'Jess');

INSERT INTO Person (id, familyId, name, nick) VALUES (4, 2, 'Micky', 'Mick');
INSERT INTO Person (id, familyId, name, nick) VALUES (5, 2, 'Lory', NULL);
INSERT INTO Person (id, familyId, name, nick) VALUES (6, 2, 'Sara', 'FuuBar');
INSERT INTO Person (id, familyId, name, nick) VALUES (7, 2, 'Jenny', NULL);

INSERT INTO Person (id, familyId, name, nick) VALUES (8, 3, 'Brian', NULL);
INSERT INTO Person (id, familyId, name, nick) VALUES (9, 3, 'Brown', NULL);
INSERT INTO Person (id, familyId, name, nick) VALUES (10, 3, 'Fuzzy', NULL);

INSERT INTO Friend (personId, friendId, isTheBest) VALUES (1, 8, 0);
INSERT INTO Friend (personId, friendId, isTheBest) VALUES (1, 6, 0);
INSERT INTO Friend (personId, friendId, isTheBest) VALUES (1, 9, 1);

INSERT INTO Friend (personId, friendId, isTheBest) VALUES (2, 4, 0);
INSERT INTO Friend (personId, friendId, isTheBest) VALUES (2, 6, 0);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP INDEX Person_ix_familyId;
DROP TABLE Friend;
DROP TABLE Person;
DROP TABLE Family;
