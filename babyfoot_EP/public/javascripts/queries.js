var promise = require('bluebird');
var express = require('express');
var path = require('path');
var pgp = require('pg-promise')(options);

var options = {
  // Initialization Options
  promiseLib: promise
};


//var connectionString = 'postgres://localhost:5432/babyfootEP';
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
  var query = "select * from encounters";
  db.any(query)
    .then(function (data) {
      res.status(200)
        .json({
         // status: 'success',
          data
        //  message: 'Retrieved ALL Matches'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}



function updateMatch(req, res, next) {
    var query = 'update encounters set state_e=true where id_e=$1';
    var matchID = parseInt(req.params.matchID);
    db.none(query,matchID)
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Updated Match : '+matchID,
          });
      }
    )
    .catch(function (err) {
      console.log("error");
      return next(err);
    });
}

function removeMatch(req, res, next) {
  var matchID = parseInt(req.params.matchID);
  //var matchID = 29;
  console.log("here et id "+matchID);
  db.none('DELETE from encounters where id_e = $1', matchID)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Removed encounter : '+matchID,
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createMatch(req, res, next) {
  var query = 'INSERT INTO ENCOUNTERS(player1,player2) VALUES ($1,$2)';
  var idp1 = req.params.idp1;
  var idp2 = req.params.idp2;
  db.none(query,[idp1,idp2])
    .then(function (data) {
      res.status(200)
        .json({
          data: data,
          status: 'success',
          message: 'Created New Match',
        });
    }
  )
  .catch(function (err) {
    console.log("error");
    return next(err);
  });
}


module.exports = {
  getAllMatches: getAllMatches,
  createMatch: createMatch,
  updateMatch: updateMatch,
  removeMatch: removeMatch
};
