class PostsDAO {
    constructor(db) {
        this._posts = db.collection('posts');
    }


}

module.exports = PostsDAO;