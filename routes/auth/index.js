const { AuthService } = require('../../services/AuthService');

const router = require('express').Router();

router.get('/auth', async (req, res) => {

    try {
        console.log('Headers: '+JSON.stringify(req.headers, null, 4));
        const wppId = req.Head;
        console.log('Wpp: '+wppId);
        await AuthService.login(req.header('wppId'), req.header('userType'))
        .then( logged =>  {
            res.statusCode = 200;
            res.send(logged);
        })
        .catch( err => {
            res.statusCode = 400;
            res.send(err);
        });
    } catch (error) {
        res.statusCode = 500;
        res.send(error);
    }

});

module.exports.AuthRouter = router;