const { AppointmentStatusService } = require('../../services/AppointmentStatusService');
const express = require('express');
const { isAuthorized } = require('../auth');
const router = require('express').Router();
router.use(express.json());

router.get('/appointmentStatus', isAuthorized, (req, res) => {

    // const appointmentStatusService = AppointmentStatusService;

    // appointmentStatusService.verifyLastRefresh();

    // console.log('Response body: ' + JSON.stringify(appointmentStatusService.getAll()));

    // res.json(appointmentStatusService.getAll());

    try {
        AppointmentStatusService.verifyLastRefresh();
        const appointmentStatus = AppointmentStatusService.getAll()
        res.statusCode = 200;
        res.send(appointmentStatus);
        // .then( appointments =>  {
        //     res.statusCode = 200;
        //     res.send(appointments);
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

router.get('/appointmentStatus/cancelled', isAuthorized, (req, res) => {

    // const appointmentStatusService = AppointmentStatusService;

    // appointmentStatusService.verifyLastRefresh();

    // console.log('Response body: ' + JSON.stringify(appointmentStatusService.getCancelledStatus()));

    // res.json(appointmentStatusService.getCancelledStatus());

    try {
        AppointmentStatusService.verifyLastRefresh();
        const cancelledAppointmentStatus = AppointmentStatusService.getCancelledStatus()
        res.statusCode = 200;
        res.send(cancelledAppointmentStatus);
        // .then( appointments =>  {
        //     res.statusCode = 200;
        //     res.send(appointments);
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

module.exports.AppointmentStatusRouter = router;