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

        })

    }
}

module.exports = PostsDAO;