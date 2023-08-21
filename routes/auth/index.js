const { AllowDevice } = require('../../services/AllowDevice');
const { AuthService } = require('../../services/AuthService');
const { WhatsappService } = require('../../services/WhatsappService');

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

router.get('/verificationToken', async (req, res) => {

    try {
        console.log('Headers: '+JSON.stringify(req.headers, null, 4));
        const wppId = req.header('wppId');
        console.log('Wpp: '+wppId);
        const token = AuthService.generateToken(wppId);
        await WhatsappService.sendTextMessages([{ chatId: wppId, text: 'Seu token de verificação do aplicativo Barbeiro:\n'+token },{ chatId: wppId, text: token }])
        .then( logged =>  {
            res.statusCode = 200;
            res.send(logged);
        })
        .catch( err => {
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
        console.log('Headers: '+JSON.stringify(req.headers, null, 4));
        const wppId = req.header('wppId');
        const token = req.header('token');
        console.log('wppId: '+wppId);
        console.log('token: '+token);
        let hex = '';
        let isValid = false;
        const promise = new Promise( async (resolve, reject) => {
            try {
                isValid = AuthService.verifyToken(wppId, token, async (key, hash) => {
                    console.log('Router received hex: '+key);
                    console.log('Storing encrypted hex...');
                    await AllowDevice.allowDevice([{wppId, hash}]).catch( err => {
                        reject(err);
                    });
                    resolve(key);
                });
            } catch (error) {
                reject(error);
            }
        });
        await promise.then( key => {
            hex = key;
        })
        .catch( err => {
            res.statusCode = 500;
            res.send(err);            
        });

        if ( isValid ) {
            res.statusCode = 200;
            res.send(hex);
        } else {
            res.statusCode = 400;
            res.send(err);            
        }

    } catch (error) {
        res.statusCode = 500;
        console.error(error);
        res.send(error);
    }

});

module.exports.AuthRouter = router;