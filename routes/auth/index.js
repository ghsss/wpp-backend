const { AllowDevice } = require('../../services/AllowDevice');
const { AuthService } = require('../../services/AuthService');
const { WhatsappService } = require('../../services/WhatsappService');

const router = require('express').Router();


module.exports.isAuthorized = async (req, res, next) => {

    try {
        console.log('Headers: ' + JSON.stringify(req.headers, null, 4));
        const token = req.header('token');
        console.log('token: ' + token);
        if (typeof token === 'undefined') throw 'Missing required Header "token"';
        if (token.length < 50) {
            res.statusCode = 400;
            res.send('Invalid token.');
            return;
        } else {
            const response = await AuthService.verifyStoredToken(token)
                .catch(err => {
                    res.statusCode = 400;
                    throw err;
                });
            if (response.success) {
                next();
                // await AuthService.login(req.header('wppId'), req.header('userType'))
                // .then( logged =>  {
                //     res.statusCode = 200;
                //     res.send(logged);
                // })
                // .catch( err => {
                //     res.statusCode = 400;
                //     res.send(err);
                // });
            } else {
                res.statusCode = 400;
                res.send(JSON.stringify({ success: false, response: [], error: ['Invalid token'] }));
                return;
            }
        }
    } catch (error) {
        res.statusCode = 500;
        res.send(error);
        return;
    }

}

router.get('/auth', this.isAuthorized, async (req, res) => {

    try {
        console.log('Headers: ' + JSON.stringify(req.headers, null, 4));
        await AuthService.login(req.header('wppId'), req.header('userType'))
            .then(logged => {
                res.statusCode = 200;
                res.send(logged);
            })
            .catch(err => {
                res.statusCode = 400;
                res.send(err);
            });
    } catch (error) {
        res.statusCode = 500;
        res.send(error);
    }

});

router.get('/verificationToken', async (req, res) => {

    try {
        console.log('Headers: ' + JSON.stringify(req.headers, null, 4));
        const wppId = req.header('wppId');
        console.log('Wpp: ' + wppId);
        const token = AuthService.generateToken(wppId);
        await WhatsappService.sendTextMessages([
            { chatId: wppId, text: 'Seu token de verificação do aplicativo Barbeiro: ' },
            { chatId: wppId, text: token }
        ])
            .then(logged => {
                res.statusCode = 200;
                res.send(logged);
            })
            .catch(err => {
                res.statusCode = 400;
                res.send(err);
            });
        // await AuthService.login(req.header('wppId'), req.header('userType'))
        // .then( logged =>  {
        //     res.statusCode = 200;
        //     res.send(logged);
        // })
        // .catch( err => {
        //     res.statusCode = 400;
        //     res.send(err);
        // });
    } catch (error) {
        res.statusCode = 500;
        res.send(error);
    }

});

router.post('/verificationToken', async (req, res) => {

    try {
        console.log('Headers: ' + JSON.stringify(req.headers, null, 4));
        const wppId = req.header('wppId');
        const token = req.header('token');
        console.log('wppId: ' + wppId);
        console.log('token: ' + token);
        let hex = '';
        let isValid = false;
        const promise = new Promise(async (resolve, reject) => {
            try {
                isValid = AuthService.verifyToken(wppId, token, async (key, hash) => {
                    console.log('Router received hex: ' + key);
                    console.log('Storing encrypted hex...');
                    if (key != 'Invalid token' && typeof hash !== undefined) {
                        await AllowDevice.allowDevice([{ wppId, hash }]).catch(err => {
                            reject(err);
                        });
                        resolve(key);
                    } else {
                        resolve(key);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
        await promise.then(key => {
            hex = key;
            if (isValid) {
                res.statusCode = 200;
                res.send(hex);
            } else {
                res.statusCode = 400;
                res.send(hex);
            }
        })
            .catch(err => {
                res.statusCode = 400;
                res.send(err);
            });

    } catch (error) {
        res.statusCode = 500;
        console.error(error);
        res.send(error);
    }

});

module.exports.AuthRouter = router;