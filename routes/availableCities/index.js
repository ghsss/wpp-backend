const router = require('express').Router();
const express = require('express');
const { CitiesService } = require('../../services/CitiesService');
// const { CustomerAppointmentRouter } = require('./appointment');
const { isAuthorized, verifyDeletionToken } = require('../auth');

router.use(express.json());
// router.use(CustomerAppointmentRouter);

router.get('/cities', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        await CitiesService.getCities()
        .then( customers =>  {
            res.statusCode = 200;
            res.send(customers);
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

module.exports.CitiesRouter = router;