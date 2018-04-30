class PostsDAO {
    constructor(db) {
        this._posts = db.collection('posts');
    }

    addPost(post, callback) {

        post['comments'] = [];
        post['date'] = new Date();

        this._posts.insert(post, function(err, inserted) {

            callback(err, inserted);

        });

    }

    getPostByTitle(title, callback) {

        this._posts.findOne({"post_title": title}, function(err, post) {

            if(err) return callback(err);

            callback(null, post);

        });

    }

    getPostByUsername(username, callback) {

        this._posts.find(username ? {"author": username} : {}).project({'_id': 0}).toArray(function(err, posts) {

            if(err) return callback(err);

            callback(null, posts);

        });

    }

    addCommentToPost(comment, callback) {

        let which_post = {'post_title': comment.post_title},
            what_to_add = { $addToSet: { 'comments' : {
                                        'author': comment.author, 
                                        'email': comment.email,
                                        'comment': comment.comment
                                    }
                            }
            };

        this._posts.update(which_post, what_to_add, function(err, result) {

            if(err) callback(err);

            if(!result.result.ok) callback(null, { found: 0 });

            callback(null, {found: result.result.ok, updated: result.result.nModified});

        });

    }
}

module.exports = PostsDAO;