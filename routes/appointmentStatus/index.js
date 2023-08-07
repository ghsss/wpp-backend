const { AppointmentStatusService } = require('../../services/AppointmentStatusService');

const router = require('express').Router();

router.get('/appointmentStatus', (req, res) => {

    const appointmentStatusService = AppointmentStatusService;

    appointmentStatusService.verifyLastRefresh();

    console.log('Response body: '+JSON.stringify(appointmentStatusService.getAll()));

    res.json(appointmentStatusService.getAll());

});

router.get('/appointmentStatus/cancelled', (req, res) => {

    const appointmentStatusService = AppointmentStatusService;

    appointmentStatusService.verifyLastRefresh();

    console.log('Response body: '+JSON.stringify(appointmentStatusService.getCancelledStatus()));

    res.json(appointmentStatusService.getCancelledStatus());

});

module.exports.AppointmentStatusRouter = router;