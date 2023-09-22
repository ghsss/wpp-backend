const router = require('express').Router();
const express = require('express');
const { BarberShopWorkerServiceService } = require('../../../services/BarberShopWorkerServiceService');
const { isAuthorized } = require('../../auth');

router.use(express.json());

router.get('/barberShop/services', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        await BarberShopWorkerServiceService.getBarberShopServices(wppId)
        .then( barberShopWorkerServices =>  {
            res.statusCode = 200;
            res.send(barberShopWorkerServices);
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

router.post('/barberShop/services', isAuthorized, async (req, res) => {

    try {
        const body = req.body;
        await BarberShopWorkerServiceService.newBarberShopWorkerServices(req.body)
        .then( barberShopWorkerServices =>  {
            res.statusCode = 200;
            res.send(barberShopWorkerServices);
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

router.put('/barberShop/services', isAuthorized, async (req, res) => {

    try {
        await BarberShopWorkerServiceService.updateBarberShopWorkerServices(req.body)
        .then( barberShopWorkerServices =>  {
            res.statusCode = 200;
            res.send(barberShopWorkerServices);
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

router.delete('/barberShop/services', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
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
        await BarberShopWorkerServiceService.deleteBarberShopWorkerServices(idsList, wppId)
        .then( barberShopWorkerService =>  {
            res.statusCode = 200;
            res.send(barberShopWorkerService);
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

module.exports.BarberShopWorkerServiceRouter = router;