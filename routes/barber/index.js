const router = require('express').Router();
const express = require('express');
const { BarberService } = require('../../services/BarberService');
const { isAuthorized } = require('../auth');

router.use(express.json());

router.get('/barbers', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        await BarberService.getBarbers(wppId)
        .then( Barbers =>  {
            res.statusCode = 200;
            res.send(Barbers);
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

router.get('/barbers', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        await BarberService.getBarbers(wppId)
        .then( Barbers =>  {
            res.statusCode = 200;
            res.send(Barbers);
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

router.post('/barbers', isAuthorized, async (req, res) => {

    try {
        const body = req.body;
        await BarberService.newBarbers(req.body)
        .then( Barbers =>  {
            res.statusCode = 200;
            res.send(Barbers);
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

router.put('/barbers', async (req, res) => {

    try {
        await BarberService.updateBarbers(req.body)
        .then( Barbers =>  {
            res.statusCode = 200;
            res.send(Barbers);
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

module.exports.BarberRouter = router;