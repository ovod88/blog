let ContentController = require('./contentController'),
    SessionController = require('./sessionController');

module.exports = (app) => {
  let contentController = new ContentController(app),
      sessionController = new SessionController(app);

  app.use(sessionController.isUser);
  
  app.get('/', contentController.get);

  app.get('/login', sessionController.getLoginPage);



  app.get('/signup', sessionController.getSignUpPage);
  app.post('/signup', sessionController.signUpUser);

  app.get('/newpost', contentController.renderPostPage);
  // app.get('/newpost/:title', contentController.renderPostPage);
  app.post('/newpost', contentController.addPost);

  app.get('/posts/:post_title', contentController.renderPostByTitle);
  app.post('/posts/:post_title/newcomment', contentController.addComment);

};




/* GET home page. */
// router.get('/', function(req, res, next) {
//   var query = {'name': 'Cake'};
//   var projection = {'batters.batter.0': 1, '_id': 0};
//   var operator = {'$set' : {'ppu': 0.65}};
  // request('https://www.reddit.com/r/technology/.json', function(err, resp, body) {
  //   if(!err && resp.statusCode == 200) {
  //     var obj = JSON.parse(body);

  //     var stories = obj.data.children.map(function(story) { return story.data;});

  //     // console.log(obj.data.children);

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

  // req.app.get('db_blog').collection('reddit').find(query).project(projection).toArray(function(err, doc) {
  //     if(err) throw err;

  //     if(!doc) {
  //           res.end();
  //         } else {
  //           res.json(doc);
  //         }
  //   });
  // req.app.get('db_blog').collection('reddit').find(query).project(projection).toArray(function(err, doc) {
  //       if(err) throw err;
  
  //       if(!doc) {
  //             res.end();
  //           } else {
  //             res.json(doc);
  //           }
  //     });
  // req.app.get('db_blog').collection('reddit').update(query, operator, function(err, updated) {
  //       if(err) throw err;
  
  //       res.send('Updated ' + updated);
  //     });
// });

// module.exports = router;
