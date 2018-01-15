var promise = require('bluebird');
var express = require('express');
var path = require('path');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/babyfootEP';
var db = pgp({//connectionString
  host: 'localhost',
  port: 5432,
  database: 'babyfootEP',
  user: 'postgres',
  password: 'ideolys'
  }
  );


// add query functions
function getAllMatches(req, res, next) {
  var query = 'SELECT id_e, state_e, idplayer1, pseudoPlayer1, id_p as idPlayer2, pseudo as pseudoplayer2 FROM PLAYER JOIN (SELECT id_p as idPlayer1, pseudo as pseudoPlayer1, id_e, idp1, idp2, state_e FROM PLAYER JOIN ENCOUNTERS ON ENCOUNTERS.idp1 = PLAYER.id_p) as SUB ON PLAYER.id_p = SUB.idp2 ORDER BY id_e '
  db.any(query)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL Matches'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createMatch(req, res, next) {
  req.body.idp1 = parseInt(req.body.idp1);
  req.body.idp2 = parseInt(req.body.idp2);
  db.none('insert into ENCOUNTERS(idp1,idp2)' +
      'values(${idp1}, ${idp2})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one encounter'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function updateMatch(req, res, next) {
  db.none('update encounters set state_e=true where id_e=$1',
    [parseInt(req.params.id_e)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated match'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeMatch(req, res, next) {
  var matchID = parseInt(req.params.id_e);
  db.result('delete from encounters where id_e = $1', matchID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} encounter`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

function createMatches2(req, res, next) {
  //var query = 'SELECT id_e, state_e, idplayer1, pseudoPlayer1, id_p as idPlayer2, pseudo as pseudoplayer2 FROM PLAYER JOIN (SELECT id_p as idPlayer1, pseudo as pseudoPlayer1, id_e, idp1, idp2, state_e FROM PLAYER JOIN ENCOUNTERS ON ENCOUNTERS.idp1 = PLAYER.id_p) as SUB ON PLAYER.id_p = SUB.idp2 ORDER BY id_e '
  var conString = {
    host: 'localhost',
    port: 5432,
    database: 'babyfootEP',
    user: 'postgres',
    password: 'ideolys'
    };
  
  var client = new pgp.Client(conString);
  client.connect();
  client.query('INSERT INTO ENCOUNTERS(idp1,idp2) VALUES ($1,$2)',[1,2]);
  
}


module.exports = {
  createMatches2: createMatches2,
  getAllMatches: getAllMatches,
  createMatch: createMatch,
  updateMatch: updateMatch,
  removeMatch: removeMatch
};
