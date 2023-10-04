const { BarberShopService } = require('../../services/BarberShopService');

const router = require('express').Router();
const express = require('express');
const { BarberShopAppointmentRouter } = require('./appointment');
const { BarberShopWorkerServiceRouter } = require('./service');
const { isAuthorized, verifyDeletionToken } = require('../auth');
const { BarberShopWorkerRouter } = require('./worker');

router.use(express.json());
router.use(BarberShopAppointmentRouter);
router.use(BarberShopWorkerRouter);
router.use(BarberShopWorkerServiceRouter);

router.get('/barberShops', isAuthorized, async (req, res) => {

    try {
        await BarberShopService.getBarberShops()
        .then( barberShops =>  {
            res.statusCode = 200;
            res.send(barberShops);
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

router.get('/barberShop/:wppId', isAuthorized, async (req, res) => {

    try {
        // const authorizedUser = req.authorizedUser;
        // console.log(authorizedUser);
        // const wppId = authorizedUser.response[0]['wppId'];
        const wppId = req.params.wppId;
        console.log(wppId);
        await BarberShopService.getBarberShopByWppId(wppId)
        // await BarberShopService.getBarberShops()
        .then( barberShop =>  {
            res.statusCode = 200;
            res.send(barberShop);
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

// router.get('/barberShop/appointments', isAuthorized, async (req, res) => {

//     try {
//         await BarberShopService.getBarberShopAppointments(req.header('wppId'))
//         .then( barberShopAppoitments =>  {
//             res.statusCode = 200;
//             res.send(barberShopAppoitments);
//         })
//         .catch( err => {
//             res.statusCode = 400;
//             res.send(err);
//         });
//     } catch (error) {
//         res.statusCode = 500;
//         res.send(error);
//     }

// });

router.post('/barberShop', isAuthorized, async (req, res) => {

    try {
        const body = req.body;
        await BarberShopService.newBarberShops(req.body)
        .then( barberShops =>  {
            res.statusCode = 200;
            res.send(barberShops);
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

router.put('/barberShop', isAuthorized, async (req, res) => {

    try {
        await BarberShopService.updateBarberShops(req.body)
        .then( barberShops =>  {
            res.statusCode = 200;
            res.send(barberShops);
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


router.delete('/barberShop', verifyDeletionToken, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.wppId;
        console.log(wppId);
        //comma separeted
        const ids = req.header('ids')
        console.log(ids);
        const idsList = ids.split(',').map( id => {
            return {id};
        });
        console.log(JSON.stringify(idsList));
        // const idsObjList = []; 
        // for (const id of ids) {
        //     idsObjList.push({'id':id});
        // }
        await BarberShopService.deleteBarberShops(idsList, wppId)
        .then( barberShops =>  {
            res.statusCode = 200;
            res.send(barberShops);
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


module.exports.BarberShopRouter = router;