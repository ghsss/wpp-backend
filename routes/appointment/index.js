const { AppointmentService } = require('../../services/AppointmentService');

const router = require('express').Router();
const express = require('express');
const { isAuthorized } = require('../auth');

router.use(express.json());

router.post('/appointments', isAuthorized, async (req, res) => {

    try {
        const body = req.body;
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        if (Array.isArray(body)) {
            for (const item of body) {
                item.createdBy = wppId;
                item.modifiedBy = wppId;
            }
        } else {
            if (typeof body === 'object') {
                item.createdBy = wppId;
                item.modifiedBy = wppId;
            }
        }
        await AppointmentService.newAppointments(req.body)
            .then(appointments => {
                res.statusCode = 200;
                res.send(appointments);
            })
            .catch(err => {
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
        const body = req.body;
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        if (Array.isArray(body)) {
            for (const item of body) {
                item.modifiedBy = wppId;
            }
        } else {
            if (typeof body === 'object') {
                item.modifiedBy = wppId;
            }
        }
        await AppointmentService.updateAppointments(body)
            .then(appointments => {
                res.statusCode = 200;
                res.send(appointments);
            })
            .catch(err => {
                res.statusCode = 400;
                res.send(err);
            });
    } catch (error) {
        res.statusCode = 500;
        res.send(error);
    }

});

router.delete('/appointments', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        //comma separeted
        const ids = req.header('ids')
        console.log(ids);
        const idsList = ids.split(',').map(id => {
            return { id };
        });
        console.log(JSON.stringify(idsList));
        // const idsObjList = []; 
        // for (const id of ids) {
        //     idsObjList.push({'id':id});
        // }
        await AppointmentService.deleteAppointments(idsList, wppId)
            .then(appointments => {
                res.statusCode = 200;
                res.send(appointments);
            })
            .catch(err => {
                res.statusCode = 400;
                res.send(err);
            });
    } catch (error) {
        res.statusCode = 500;
        res.send(error);
    }

});

module.exports.AppointmentRouter = router;