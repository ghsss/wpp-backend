const router = require('express').Router();
const express = require('express');
const { CustomerService } = require('../../services/CustomerService');
const { CustomerAppointmentRouter } = require('./appointment');
const { isAuthorized, verifyDeletionToken } = require('../auth');

router.use(express.json());
router.use(CustomerAppointmentRouter);

router.get('/customers', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        await CustomerService.getCustomers(wppId)
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

router.get('/customers', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        await CustomerService.getCustomers(wppId)
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

router.post('/customers', isAuthorized, async (req, res) => {

    try {
        const body = req.body;
        await CustomerService.newCustomers(req.body)
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

router.put('/customers', async (req, res) => {

    try {
        await CustomerService.updateCustomers(req.body)
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

router.delete('/customer', verifyDeletionToken, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.wppId;
        console.log(wppId);
        //comma separeted
        const ids = req.header('ids')
        console.log(ids);
        const idsList = ids.split(',').map( id => {
            return {id};
        });
        console.log(JSON.stringify(idsList));
        // const idsObjList = []; 
        // for (const id of ids) {
        //     idsObjList.push({'id':id});
        // }
        await CustomerService.deleteCustomers(idsList, wppId)
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

module.exports.CustomerRouter = router;