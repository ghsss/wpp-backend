const { AppointmentService } = require('../../services/AppointmentService');

const router = require('express').Router();
const express = require('express');

router.use(express.json());

router.post('/appointments', async (req, res) => {

    try {
        const body = req.body;
        await AppointmentService.newAppointments(req.body)
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

router.put('/appointments', async (req, res) => {

    try {
        await AppointmentService.updateAppointments(req.body)
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

module.exports.AppointmentRouter = router;