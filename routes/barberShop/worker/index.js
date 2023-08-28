const { BarberShopWorkerService } = require('../../../services/BarberShopWorkerService.js');

const router = require('express').Router();
const express = require('express');
const { isAuthorized } = require('../../auth');

router.use(express.json());

router.get('/barberShopWorkers', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        await BarberShopWorkerService.getBarberShopWorkers(wppId)
        .then( barberShopWorkers =>  {
            res.statusCode = 200;
            res.send(barberShopWorkers);
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

router.get('/barberShopWorker/:wppId', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        await BarberShopWorkerService.getBarberShopWorkersByWppId(wppId)
        // await BarberShopWorkerService.getBarberShopWorkers()
        .then( barberShop =>  {
            res.statusCode = 200;
            res.send(barberShop);
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

// router.get('/barberShopWorker/appointments', isAuthorized, async (req, res) => {

//     try {
//         await BarberShopWorkerService.getBarberShopAppointments(req.header('wppId'))
//         .then( barberShopAppoitments =>  {
//             res.statusCode = 200;
//             res.send(barberShopAppoitments);
//         })
//         .catch( err => {
//             res.statusCode = 400;
//             res.send(err);
//         });
//     } catch (error) {
//         res.statusCode = 500;
//         res.send(error);
//     }

// });

router.post('/barberShopWorker', isAuthorized, async (req, res) => {

    try {
        const body = req.body;
        await BarberShopWorkerService.newBarberShopWorkers(req.body)
        .then( barberShopWorkers =>  {
            res.statusCode = 200;
            res.send(barberShopWorkers);
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

router.put('/barberShopWorker', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
        console.log(wppId);
        // ADICIONAR SEGUNDO PARAMETRO wppId NO METODO updateBarberShopWorkers 
        // E CONDICAO NA CLAUSULA WHERE SE BARBER ID = WPPID OU BARBERSHOP.WPPID = WPPID
        // PARA PERMITIR SOMENTE ATUALIZAR O REGISTRO SE FOR A BARBEARIA OU O BARBEIRO VINCULADO AO ID
        await BarberShopWorkerService.updateBarberShopWorkers(req.body)
        .then( barberShopWorkers =>  {
            res.statusCode = 200;
            res.send(barberShopWorkers);
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

module.exports.BarberShopWorkerRouter = router;