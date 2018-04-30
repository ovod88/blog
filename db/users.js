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

    validateLogin(username, password, callback) {

        this._users.findOne({'_id': username.trim()}, function(err, user) {

            if(err) return callback(err);

            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    callback(null, user);
                } else {
                    var invalid_password_error = new Error("Invalid password");
                    invalid_password_error.invalid_password = true;

                    callback(invalid_password_error, null);
                }
            }
            else {
                var no_such_user_error = new Error("User: " + username + " does not exist");
                no_such_user_error.no_such_user = true;

                callback(no_such_user_error, null);
            }

        });

    }

}



module.exports = UsersDAO;