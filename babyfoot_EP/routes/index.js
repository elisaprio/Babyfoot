var express = require('express');
var router = express.Router();
var path = require('path');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/', 'layout2.html'));
});


var db = require('../public/javascripts/queries');


router.get('/all', db.getAllMatches);
router.post('/api/babyfootEP/create', db.createMatch);
router.put('/api/babyfootEP/update/:id_e', db.updateMatch);
router.delete('/api/babyfootEP/remove/:id_e', db.removeMatch);







module.exports = router;
