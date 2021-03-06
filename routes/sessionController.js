let UsersDAO = require('../db/users'),
    SessionsDAO = require('../db/sessions');

class SessionController {
    constructor(app) {

        this.signUpUser = this.signUpUser.bind(this);
        this.getLogoutPage = this.getLogoutPage.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.isUser = this.isUser.bind(this);
        // console.log('++++++++++++++ ');
        // console.log(app.settings);
        this._usersDAO = new UsersDAO(app.get('db_blog'));
        this._sessionsDAO = new SessionsDAO(app.get('db_blog'));

    }

    isUser(req, res, next) {
        
        res.locals.user = null;

        // console.log('SESSION CHECKER CALLED +++++++++++++++++++++++=');
        console.log(req.cookies.session);
        let session_id = req.cookies.session;

        if( session_id ) {
            // console.log('RETURNS TRUE');
            this._sessionsDAO.getUserBySessionId(session_id, function(err, username) {
                // console.log('RETURNS INSIDE');
                if(err) next(err);
                // console.log('USERNAME ' + username);
                if(username) {
                    // console.log('INSIDE');
                    res.locals.user = username;
                    // console.log(res.locals);
                }
                next();
            }); 
        } else {
            next();
        }
        // console.log('ÁFTER CHECKER++++++++++++ ');
        // console.log(res.locals);
    }

    getLoginPage(req, res, next) {

        res.render('login', {username: "", login_error:""});

    }

    loginUser(req, res, next) {

        let username = req.body.username,
            password = req.body.password,
            that = this;

        this._usersDAO.validateLogin(username, password, function(err, user) {

            if (err) {
                if (err.no_such_user) {
                    return res.render("login", {username:username, password:"", login_error:"No such user"});
                }
                else if (err.invalid_password) {
                    return res.render("login", {username:username, password:"", login_error:"Invalid password"});
                }
                else {
                    return next(err);
                }
            }

            that._sessionsDAO.startSession(user['_id'], function(err, session_id) {

                if (err) return next(err);

                res.cookie('session', session_id);

                return res.redirect('/');

            });

        });

    }

    getLogoutPage(req, res, next) {

        let session_id = req.cookies.session;

        this._sessionsDAO.endSession(session_id, function (err) {
            
            if(err) return next(err);

            res.clearCookie('session');

            return res.redirect('/');
        });

    }

    getSignUpPage(req, res, next) {

        res.render('signup', {username: "", email: "", username_error:"", password_error: "", password_repeat_error: "",
                    email_error: ""});

    }

    signUpUser(req, res, next) {
        let email = req.body.email,
            username = req.body.username,
            password = req.body.password,
            repeat_password = req.body.repeat_password,
            errors = {'username': username, 'email': email},
            that = this;

        // console.log(this);

        if(this.newClientIsOk(username, password, repeat_password, email, errors)) {

            console.log('CALLED' + '#######################################');
            
            this._usersDAO.addUser(username, password, email, function(err) {

                console.log(err);
                if(err) {
                    console.log('ERROR');
                    if( err.code === 11000 ) {

                        errors['username_error'] = 'Such username is used already';

                    } else {

                        errors['username_error'] = 'Can\'t save this username';

                    }

                    return res.render('signup', errors);

                } else {

                    // console.log(this);
                    that._sessionsDAO.startSession(username, function(err, session_id) {

                        if (err) return next(err);
                        console.log('AFTER');

                        res.cookie('session', session_id);
                        res.redirect('/');

                    });

                }

            });

        } else {

            return res.render('signup', errors);

        }

    }

    newClientIsOk(username, password, repeat_password, email, errors) {
        let isOk = true,
            USER_RE = /^[a-zA-Z0-9_-]{3,15}$/,
            PASS_RE = /^.{3,8}$/,
            EMAIL_RE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        errors['username_error'] = "";
        errors['password_error'] = "";
        errors['password_repeat_error'] = "";
        errors['email_error'] = "";

        if (!USER_RE.test(username)) {
            errors['username_error'] = "Invalid username. Use from 3 up to 15 letters or numbers";
            isOk = false;
        }
        if (!PASS_RE.test(password)) {
            errors['password_error'] = "Invalid password. Use no more 8 symbols and no less 3";
            isOk = false;
        }
        if (password != repeat_password) {
            errors['password_repeat_error'] = "Passwords not match";
            isOk = false;
        }
        if (!EMAIL_RE.test(email) || email === '') {
            errors['email_error'] = "Invalid or empty email address";
            isOk = false;
        }

        return isOk;
    }
 
}




module.exports = SessionController;