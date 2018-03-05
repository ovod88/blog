var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.app.get('db_blog').collection('hello_message').findOne({}, function(err, doc) {
    if(err) throw err;
    res.render('index', doc);
  });
});

module.exports = router;
