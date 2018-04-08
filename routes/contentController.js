
class ContentController {
    constructor() {}

    get (req,res) {

        res.render('index', {
            'title': 'My Blog'
        });

    }
}




module.exports = ContentController;