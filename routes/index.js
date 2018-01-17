var express = require('express');
var router = express.Router();
var path = require('path');

const connectionString ={
  host: 'localhost',
  port: 5432,
  database: 'babyfootEP',
  user: 'postgres',
  password: 'ideolys'
  };

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/', 'main.html'));
});


var db = require('../public/javascripts/queries');



router.get('/all', db.getAllMatches);
router.get('/new/:idp1&:idp2',db.createMatch);
router.get('/update/:matchID&:state_e',db.updateMatch);
router.get('/remove/:matchID',db.removeMatch);





module.exports = router;
