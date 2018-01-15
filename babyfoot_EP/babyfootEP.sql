{
    "postgreSql.dbName": "babyfoot",
    "postgreSql.hostName": "PostgreSQL 10",
    "postgreSql.username": "postgres"
}

DROP DATABASE IF EXISTS babyfootEP;
CREATE DATABASE babyfootEP;

-- \c babyfootEP;

CREATE TABLE PLAYER
	(
     id_p INT GENERATED BY DEFAULT AS IDENTITY (START WITH 1) PRIMARY KEY ,
     pseudo CHAR(30)
    );

CREATE TABLE ENCOUNTERS
	(
     id_e INT GENERATED BY DEFAULT AS IDENTITY (START WITH 1) PRIMARY KEY,  
     idp1 INT, 
     idp2 INT,
        FOREIGN KEY (idp1) REFERENCES PLAYER (id_p),
        FOREIGN KEY (idp2) REFERENCES PLAYER (id_p)
    );
    
 CREATE TABLE MATCHS
	(
     id_m INT GENERATED BY DEFAULT AS IDENTITY (START WITH 1) PRIMARY KEY,
     state_match CHAR(30),
     winner_match CHAR(30),
     id_e INT,
        FOREIGN KEY (id_e) REFERENCES ENCOUNTERS (id_e)
    );



INSERT INTO PLAYER(pseudo) VALUES ('Elisa');
INSERT INTO PLAYER(pseudo) VALUES ('Tristan');
INSERT INTO PLAYER(pseudo) VALUES ('Adil');
INSERT INTO PLAYER(pseudo) VALUES ('Lea');
INSERT INTO PLAYER(pseudo) VALUES ('Adele');
INSERT INTO PLAYER(pseudo) VALUES ('Loic');

INSERT INTO ENCOUNTERS(idp1,idp2) VALUES (1,2);
INSERT INTO ENCOUNTERS(idp1,idp2) VALUES (3,4);
INSERT INTO ENCOUNTERS(idp1,idp2) VALUES (5,6);
INSERT INTO ENCOUNTERS(idp1,idp2) VALUES (3,6);
INSERT INTO ENCOUNTERS(idp1,idp2) VALUES (4,2);
INSERT INTO ENCOUNTERS(idp1,idp2) VALUES (1,5);

INSERT INTO MATCHS (state_match,result_match,id_e) VALUES ('start',null,1);
INSERT INTO MATCHS (state_match,result_match,id_e) VALUES ('end','P2 wins',2);
INSERT INTO MATCHS (state_match,result_match,id_e) VALUES ('end','P1 wins',3);
INSERT INTO MATCHS (state_match,result_match,id_e) VALUES ('start',null,4);
INSERT INTO MATCHS (state_match,result_match,id_e) VALUES ('end','P1 wins',5);
INSERT INTO MATCHS (state_match,result_match,id_e) VALUES ('end','P2 wins',6);


Select MATCHS.id_m,
(SELECT pl.pseudo FROM PLAYER as pl 
 JOIN ENCOUNTERS as en ON pl.id_p = en.idp1
 WHERE pl.id_p = en.idp1) AS FirstPlayerName,
(SELECT pl.pseudo FROM PLAYER as pl 
JOIN ENCOUNTERS as en ON pl.id_p = en.idp2
WHERE pl.id_p = en.idp2) As SecondPlayerName,
FROM MATCHS
JOIN ENCOUNTERS ON MATCHS.id_e = ENCOUNTERS.id_e
;