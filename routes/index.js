var express = require('express');
var request  = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // request('https://www.reddit.com/r/technology/.json', function(err, resp, body) {
  //   if(!err && resp.statusCode == 200) {
  //     var obj = JSON.parse(body);

  //     var stories = obj.data.children.map(function(story) { return story.data;});

  //     req.app.get('db_blog').collection('reddit').insert(stories, function(err, data) {
  //       if(err) throw err;

  //       res.json(data);
  //     });
  //   }
  // });
  // req.app.get('db_blog').collection('hello_message').findOne({}, function(err, doc) {
  //   if(err) throw err;
  //   res.render('index', doc);
  // });
  // req.app.get('db_blog').collection('grades').find({'grade': 90}).toArray( function(err, doc) {
  //   if(err) throw err;
  //   if(!doc) {
  //     res.render('index', {"title": 'No title'});
  //   } else {
  //     res.json(doc);
  //   }
  // });
});

module.exports = router;
