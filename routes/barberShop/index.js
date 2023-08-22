const { BarberShopService } = require('../../services/BarberShopService');

const router = require('express').Router();
const express = require('express');
const { BarberShopAppointmentRouter } = require('./appointment');
const { BarberShopWorkerServiceRouter } = require('./service');

router.use(express.json());
router.use(BarberShopAppointmentRouter);
router.use(BarberShopWorkerServiceRouter);

router.get('/barberShops', async (req, res) => {

    try {
        await BarberShopService.getBarberShops()
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

router.get('/barberShop/:wppId', async (req, res) => {

    try {
        await BarberShopService.getBarberShopByWppId(req.url.wppId)
        // await BarberShopService.getBarberShops()
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

router.get('/barberShop/appointments', async (req, res) => {

    try {
        await BarberShopService.getBarberShopAppointments(req.header('wppId'))
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

router.post('/barberShop', async (req, res) => {

    try {
        const body = req.body;
        await BarberShopService.newBarberShops(req.body)
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

router.put('/barberShop', async (req, res) => {

    try {
        await BarberShopService.updateBarberShops(req.body)
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

module.exports.BarberShopRouter = router;