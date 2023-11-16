const router = require('express').Router();
const express = require('express');
const { AppointmentService } = require('../../../../services/AppointmentService');
const { isAuthorized } = require('../../../auth');

router.use(express.json());


router.get('/barberShopWorker/:workerId/appointments/:date', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        // const wppId = authorizedUser.response[0]['wppId'];
        const workerId = req.params.workerId;
        const date = req.params.date;
        console.log(workerId);
        console.log(date);
        await AppointmentService.getBarberShopWorkerAppointmentsByDate(Number(workerId), date)
        // await BarberShopWorkerService.getBarberShopWorkers()
        .then( barberShop =>  {
            res.statusCode = 200;
            res.send(barberShop);
        })
        .catch( err => {
            res.statusCode = 400;
            res.send(err);
        });
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.send(error);
    }

});

router.get('/barberShopWorker/appointments', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        const barberShop = req.header('barberShop');
        await AppointmentService.getBarberShopWorkerAppointments(wppId, barberShop)
        .then( barberShopAppointments =>  {
            res.statusCode = 200;
            res.send(barberShopAppointments);
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

module.exports.BarberShopWorkerAppointmentRouter = router;