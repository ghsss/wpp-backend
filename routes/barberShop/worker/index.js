const { BarberShopWorkerService } = require('../../../services/BarberShopWorkerService.js');

const router = require('express').Router();
const express = require('express');
const { isAuthorized } = require('../../auth');
const { BarberShopWorkerAppointmentRouter } = require('./appointment/index.js');

router.use(express.json());
router.use(BarberShopWorkerAppointmentRouter);

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

router.get('/barberShop/:barberShopId/worker/:wppId', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        // const wppId = authorizedUser.response[0]['wppId'];
        const barberShopId = req.params.barberShopId;
        const wppId = req.params.wppId;
        console.log(wppId);
        await BarberShopWorkerService.getBarberShopWorkersByBarberShopIdAndWppId(barberShopId, wppId)
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

router.get('/barberShopWorker/:wppId', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        // const wppId = authorizedUser.response[0]['wppId'];
        const wppId = req.params.wppId;
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
        await BarberShopWorkerService.updateBarberShopWorkers(req.body, wppId)
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

router.delete('/barberShopWorker', isAuthorized, async (req, res) => {

    try {
        const authorizedUser = req.authorizedUser;
        console.log(authorizedUser);
        const wppId = authorizedUser.response[0]['wppId'];
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
        await BarberShopWorkerService.deleteBarberShopWorkers(idsList, wppId)
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