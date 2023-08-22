const router = require('express').Router();
const express = require('express');
const { AppointmentService } = require('../../../services/AppointmentService');
const { isAuthorized } = require('../../auth');

router.use(express.json());

router.get('/barberShop/appointments', isAuthorized, async (req, res) => {

    try {
        await AppointmentService.getBarberShopAppointments(req.header('wppId'))
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

module.exports.BarberShopAppointmentRouter = router;