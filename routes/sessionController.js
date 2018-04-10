let UsersDAO = require('../db/users');

class SessionController {
    constructor(app) {
        this.signUpUser = this.signUpUser.bind(this);
        // console.log('++++++++++++++ ');
        // console.log(app.settings);
        this._usersDAO = new UsersDAO(app.get('db_blog'));
    }

    isUser(req, res, next) {
        
        res.locals.user = null;
        //TODO Check is there is cookie and session already



        next();
    }

    getLoginPage(req, res, next) {

        res.render('login', {username: "", login_error:""});

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
            errors = {'username': username, 'email': email};

        // console.log(this);

        if(this.newClientIsOk(username, password, repeat_password, email, errors)) {
            
            this._usersDAO.addUser(username, password, email, function(err) {
                if(err) {
                    if( err.code === 11000 ) {

                        errors['username_error'] = 'Such username is used already';

                    } else {

                        errors['username_error'] = 'Cant save this username';

                    }
                    res.render('signup', errors);

                } else {

                    res.redirect('/');

                }

            });

        } else {

            res.render('signup', errors);

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