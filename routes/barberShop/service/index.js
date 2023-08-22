const router = require('express').Router();
const express = require('express');
const { BarberShopWorkerServiceService } = require('../../../services/BarberShopWorkerService');

router.use(express.json());

router.get('/barberShop/services', async (req, res) => {

    try {
        await BarberShopWorkerServiceService.getBarberShopServices(req.header('wppId'))
        .then( customerAppointments =>  {
            res.statusCode = 200;
            res.send(customerAppointments);
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

router.post('/barberShop/services', async (req, res) => {

    try {
        const body = req.body;
        await BarberShopWorkerServiceService.newBarberShopWorkerServices(req.body)
        .then( customerAppointments =>  {
            res.statusCode = 200;
            res.send(customerAppointments);
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