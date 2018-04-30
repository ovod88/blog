let bcrypt = require('bcryptjs');

class UsersDAO {
    constructor(db) {
        this._users = db.collection('users');
    }

    addUser(username, password, email, callback) {
        let salt = bcrypt.genSaltSync(10),
            hash = bcrypt.hashSync(password, salt),
            user = {'_id': username, 'password': hash, 'email': email};

        this._users.insert(user, function(err, inserted) {

            if(err) return callback(err);

            // console.log(inserted);
            callback(null);

        });
    }

}



module.exports = UsersDAO;