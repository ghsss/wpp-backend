const router = require('express').Router();
const express = require('express');
const { AppointmentService } = require('../../../../services/AppointmentService');
const { isAuthorized } = require('../../../auth');

router.use(express.json());

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