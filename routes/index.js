var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'EPAM TV' });
});

router.get('/slideshow', function(req, res) {
  res.render('slideshow');
});


module.exports = router;
