const router = require('express').Router();
const express = require('express');
const { CustomerService } = require('../../services/CustomerService');
const { CustomerAppointmentRouter } = require('./appointment');

router.use(express.json());
router.use(CustomerAppointmentRouter);

router.get('/customers', async (req, res) => {

    try {
        await CustomerService.getCustomers(req.header('wppId'))
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

router.get('/customers', async (req, res) => {

    try {
        await CustomerService.getCustomers(req.header('wppId'))
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

router.post('/customers', async (req, res) => {

    try {
        const body = req.body;
        await CustomerService.newCustomers(req.body)
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

router.put('/customers', async (req, res) => {

    try {
        await CustomerService.updateCustomers(req.body)
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

module.exports.CustomerRouter = router;