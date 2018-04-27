let sanitize = require('validator'),
    PostsDAO = require('../db/posts');

class ContentController {
    constructor(app) {

        this.addPost = this.addPost.bind(this);
        this._postsDAO = new PostsDAO(app.get('db_blog'));

    }

    get (req, res, next) {


        // console.log(res.locals);
        res.render('index', {
            'title': 'My Blog'
        });

    }

    renderPostPage(req, res, next) {

        if (!res.locals.user) return res.redirect("/");

        res.render('newpost', {
            'content': {'title': '', 'body': '', 'tags': ''},
            'error': {'title': '', 'body': ''}
        });

    }

    _getTagsArray(string) {

        let tags = new Set(),
            tags_array = string.split(',');

        for (let i = 0; i < tags_array.length; i++) {
            tags.add(tags_array[i]);
        }

        return [...tags];

    }

    addPost(req, res, next) {
        let title = req.body.title,
            body = req.body.body,
            tags = req.body.tags,
            post_title,
            post_body,
            post_tags;
        
        if (!res.locals.user) return res.redirect("/");

        // console.log(sanitize.escape(body.replace(/\r?\n/g,'<br>')));
            
        if(!title || !body) {

            return res.render('post', {
                'content': {'title': title, 'body': body, 'tags': tags},
                'error': {'title': !title ? 'No title' : '', 'body': !body ? 'No text' : ''}
            });
        }

        post_title = title.replace( /\s/g, '_' );
        post_title = post_title.replace( /\W/g, '' );

        post_body = sanitize.escape(body.replace(/\r?\n/g,'<br>'));

        post_tags = this._getTagsArray(tags);

        this._postsDAO.addPost({
            "title": title,
            "author": res.locals.user,
            "body": post_body,
            "post_title": post_title,
            "tags": post_tags
        }, function(err, added) {
            if(err) return next(err);

            return res.redirect("/posts/" + post_title);
        });

    }

    renderPostByTitle(req, res, next) {

        let title = req.params.post_title;

        this._postsDAO.getPostByTitle(title, function(err, post) {

            if(err) next(err);

            if(post) {
                res.render('post', post);
            } else {
                res.render('post', {});
            }

        });

    }
}




module.exports = ContentController;