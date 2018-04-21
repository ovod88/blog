let sanitize = require('validator');

class ContentController {
    constructor() {}

    get (req, res, next) {


        // console.log(res.locals);
        res.render('index', {
            'title': 'My Blog'
        });

    }

    renderPostPage(req, res, next) {

        if (!res.locals.user) return res.redirect("/");

        res.render('post', {
            'content': {'title': '', 'body': '', 'tags': ''},
            'error': {'title': '', 'body': ''}
        });

    }

    addPost(req, res, next) {
        let title = req.body.title,
            body = req.body.body,
            tags = req.body.tags;

        console.log(sanitize.escape(body.replace(/\r?\n/g,'<br>')));
            
        if(!title || !body) {

            res.render('post', {
                'content': {'title': title, 'body': body, 'tags': tags},
                'error': {'title': !title ? 'No title' : title, 'body': !body ? 'No text' : body}
            });
        }

    }
}




module.exports = ContentController;