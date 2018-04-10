const crypto = require('crypto');

class SessionsDAO {
    constructor(db) {
        this._sessions = db.collection('sessions');
    }

    startSession(username, callback) {
        let current_date = (new Date()).valueOf().toString(),
            random = Math.random().toString(),
            session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');

            this._sessions.insert({'_id': session_id, 'username': username}, function(err, inserted) {

                callback(err, session_id);

            });
    }

    getUserBySessionId(session_id, callback) {

        this._sessions.findOne({'_id': session_id}, function(err, session) {

            if(err) callback(err);

            if(!session) {
                
                return callback();
            
            }

            callback(null, session.username);

        });

    }

}



module.exports = SessionsDAO;