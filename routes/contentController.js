let sanitize = require('validator'),
    PostsDAO = require('../db/posts');

class ContentController {
    constructor(app) {

        this.addPost = this.addPost.bind(this);
        this.get = this.get.bind(this);
        this.getByTag = this.getByTag.bind(this);
        this.addComment = this.addComment.bind(this);
        this.renderPostByTitle = this.renderPostByTitle.bind(this);
        this._postsDAO = new PostsDAO(app.get('db_blog'));

    }

    get (req, res, next) {

        this._postsDAO.getPostByUsername(res.locals.user, function(err, posts) {

            if(err) next(err);

            // console.log(posts);

            return res.render('index', {
                'title': 'My Blog',
                'posts': posts
            });

        });

    }

    getByTag(req, res, next) {

        this._postsDAO.getPostByTag((req.params.tag).trim(), function(err, posts) {

            if(err) next(err);

            // console.log(posts);

            return res.render('index', {
                'title': 'My Blog',
                'posts': posts
            });

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
            tags.add(tags_array[i].trim());
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

        post_body = sanitize.escape(body);
        post_body = post_body.replace(/\r?\n/g,'<br>');

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

    addComment(req, res, next) {

        let post_title = req.body.post_title,
            author = req.body.comment_author,
            email = req.body.comment_email,
            comment = req.body.comment_comment;
        
        if (res.locals.user) {
            
            author = res.locals.user;

        }
        if(!author || !comment) {

            return res.status(500).send('Some fields are empty');

        }
        
        this._postsDAO.addCommentToPost({
            post_title: post_title,
            author: author,
            email: email,
            comment: comment
        }, function(err, post) {

            if(err) next(err);

            if(!post.found) {
                
                return res.status(500).send('No posts were found for this comment');
                
            }
            if(post.found && post.updated) {
                return res.json({
                    author: author,
                    email: email,
                    comment: comment
                });
            } else {
                return res.json({});
            }

        });

    }
}




module.exports = ContentController;