const { AppointmentService } = require('../../services/AppointmentService');

const router = require('express').Router();
const express = require('express');
const { isAuthorized } = require('../auth');

router.use(express.json());

router.post('/appointments', isAuthorized, async (req, res) => {

    try {
        const body = req.body;
        await AppointmentService.newAppointments(req.body)
        .then( appointments =>  {
            res.statusCode = 200;
            res.send(appointments);
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

router.put('/appointments', isAuthorized, async (req, res) => {

    try {
        await AppointmentService.updateAppointments(req.body)
        .then( appointments =>  {
            res.statusCode = 200;
            res.send(appointments);
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