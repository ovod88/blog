
class ContentController {
    constructor() {}

    get (req, res, next) {


        // console.log(res.locals);
        res.render('index', {
            'title': 'My Blog'
        });

    }
}




module.exports = ContentController;