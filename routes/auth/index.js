const { response } = require('express');
const { AllowDevice } = require('../../services/AllowDevice');
const { AuthService } = require('../../services/AuthService');
const { WhatsappService } = require('../../services/WhatsappService');

const router = require('express').Router();


module.exports.isAuthorized = async (req, res, next) => {

    try {
        console.log('Headers: ' + JSON.stringify(req.headers, null, 4));
        const token = req.header('token');
        console.log('token: ' + token);
        if (typeof token === 'undefined' || token == 'undefined') throw 'Missing required Header "token"';
        if (token.length < 50) {
            console.log('INVALID TOKEN PROVIDED: ' + token);
            res.statusCode = 400;
            res.send('Invalid token.');
            // return;
        } else {
            console.log('VALID TOKEN PROVIDED: ' + token);
            await AuthService.verifyStoredToken(token)
                .then(response => {

                    if (response.success) {
                        console.log('PROVIDED TOKEN IS VALID? ' + JSON.stringify(response));
                        console.log();
                        req.authorizedUser = response;
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
                        // return;
                    }

                })
                .catch(err => {
                    res.statusCode = 401;
                    console.log('PROVIDED TOKEN IS INVALID: ' + err);
                    res.send(JSON.stringify({ success: false, response: [], error: ['Invalid token'] }));
                    // throw err;
                });
        }
    } catch (error) {
        res.statusCode = 500;
        console.log('ERROR 500: ' + error);
        res.send(error);
        // return;
    }

}

module.exports.verifyDeletionToken = async (req, res, next) => {

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
                        // await AllowDevice.allowDevice([{ wppId, hash }]).catch(err => {
                        //     reject(err);
                        // });
                        resolve(key);
                    } else {
                        reject(key);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
        await promise.then(key => {
            hex = key;
            console.log('Valid token!!!\n' + hex);
            // if (isValid) {
            res.statusCode = 200;
            req.authorizedUser = { wppId };
            // req.isValid = isValid;
            next();
            // res.send(hex);
            // } else {
            //     res.statusCode = 400;
            //     res.send(hex);
            // }
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

}

router.get('/auth', this.isAuthorized, async (req, res) => {

    try {
        console.log('Headers: ' + JSON.stringify(req.headers, null, 4));
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        await AuthService.login(wppId, req.header('userType'))
            .then(logged => {
                console.log('RESPONSE LOGGED');
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

router.delete('/logout', this.isAuthorized, async (req, res) => {

    try {
        console.log('Headers: ' + JSON.stringify(req.headers, null, 4));
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        const token = req.header('token');
        await AuthService.logout(token)
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
            { chatId: wppId, text: 'Seu token de verificação do aplicativo Barbeiro: \n*' + token + '*' }
            // { chatId: wppId, text: token }
        ])
            .then(async logged => {
                res.statusCode = 200;
                // if ('error' in err && Array.isArray(err.error) && err.error[0].includes('Session closed')) {
                //     await WhatsappService.initializeClient();
                // }
                res.send(logged);
            })
            .catch(async err => {
                res.statusCode = 400;
                // if ('error' in err && Array.isArray(err.error) && err.error[0].includes('Session closed')) {
                //     await WhatsappService.initializeClient();
                // }
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