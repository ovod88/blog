class SessionController {
    constructor() {}

    isUser(req, res, next) {
        res.locals.user = null;

        //TODO Check is there is cookie and session already



        next();
    }

    getLoginPage(req, res, next) {

        res.render('login', {username: "", login_error:""});

    }

    getSignUpPage(req, res, next) {

        res.render('signup', {username: "", user_error:"", password_error: "", password_repeat_error: "",
                    email_error: ""});

    }

    signUpUser(req, res, next) {
        let credentials = req.body;

        console.log(credentials);

        res.end('Buy');
    }

    verifyNewUser() {

    }
 
}




module.exports = SessionController;