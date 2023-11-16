const { BarberShopClass } = require("../models/BarberShop");
const { BarberShopWorkerServiceService } = require("./BarberShopWorkerServiceService");
// const { BarberShopStatusService } = require("./BarberShopStatusService");
const { DatabaseService } = require("./DatabaseService");

class BarberShopService {

    database = DatabaseService;
    #selectedbarberShop = BarberShopClass;
    #barberShopList = new Array(BarberShopClass);

    constructor(jsonData) {


        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a valid JSON as argument.\n' + error);
            }
        }

        // serialize();

    }

    refresh(jsonData) {

    }

    async getBarberShopByWppId(barberShopWppId) {
        const pool = this.database.getPool();
        const response = {
            success: false,
            response: []
        }
        const newList = [];
        // const newList = Array();
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT 
                bs.id as barberShopId, bs.name as barberShopName, bs.phone as barberShopPhone, bs.city as barberShopCity, cy.name as barberShopCityName, 
                bs.neighborhood as barberShopNeighborhood, bs.street as barberShopStreet, bs.number as barberShopNumber, bs.complement barberShopComplement, 
                bs.availableDays, bs.availableHours, 
                bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId as barberShopWppId
                FROM barberShop AS bs
                JOIN city AS cy ON cy.id = bs.city 
                WHERE bs.wppId = ? OR bs.id = ?
                GROUP BY bs.wppId`,
                [barberShopWppId, barberShopWppId],
                function (err, rows, fields) {
                    if (err) reject(err);
                    // {
                    //     "id": 3,
                    //     "dayAndTime": "2023-08-08T04:46:46.000Z",
                    //     "createdBy": null,
                    //     "barberShopStatus": "Agendado",
                    //     "modifiedBy": null,
                    //     "createdAt": "2023-08-08T04:46:46.000Z",
                    //     "modifiedAt": "2023-08-08T04:46:46.000Z",
                    //     "BarberShopId": "555499026453@c.us",
                    //     "BarberShopName": "Gabriel",
                    //     "BarberShopPhone": "555499026453",
                    //     "barberShopId": 1,
                    //     "barberShopName": "Barbearia do Gabriel",
                    //     "barberShopPhone": "",
                    //     "barberShopCity": "CZO",
                    //     "barberShopCityName": "Carazinho",
                    //     "barberShopNeighborhood": "Centro",
                    //     "barberShopStreet": "Alexandre da Motta",
                    //     "barberShopNumber": "1264",
                    //     "barberShopComplement": null,
                    //     "geolocationLatitude": "-28",
                    //     "geolocationLongitude": "-53",
                    //     "barberShopWppId": "",
                    //     "workerId": "555499026453@c.us",
                    //     "workerName": "Gabriel",
                    //     "workerPhone": "555499026453"
                    // }
                    // Connection is automatically released when query resolves
                    if (Array.isArray(rows)) {
                        console.log('Fist row ' + JSON.stringify(rows[0], null, 4));
                        for (const row of rows) {
                            let barberShopStatus = new BarberShopClass(row);
                            newList.push(barberShopStatus);
                        }
                        pool.query(
                            `SELECT  
                            b.id AS workerWppId, b.name AS workerName, b.phone AS workerPhone, bsw.id AS workerId 
                            FROM barberShopWorker AS bsw 
                            JOIN barberShop AS bs ON bs.id = bsw.barberShop 
                            JOIN barber AS b ON b.id = bsw.worker
                            WHERE bs.wppId = ? OR bs.id = ?`,
                            [barberShopWppId, barberShopWppId],
                            async function (err2, rows2, fields2) {
                                if (err2) {
                                    reject(err2);
                                }
                                console.log('Workers: ' + JSON.stringify(rows2));
                                if (Array.isArray(rows2)) {
                                    for await (let row2 of rows2) {
                                        const workerServices = await BarberShopWorkerServiceService.getBarberShopServicesByWorkerId(rows[0].barberShopWppId, row2.workerId);
                                        row2.workerServices = workerServices;
                                    }
                                    newList.forEach(item => {
                                        item.workers = rows2;
                                    });
                                    resolve(newList)
                                } else {
                                    resolve(newList)
                                }

                            });

                    } else {
                        resolve(newList);
                    }
                    console.log('List: ' + JSON.stringify(newList));
                });
        });

    }

    getBarberShops() {
        const pool = this.database.getPool();
        const response = {
            success: false,
            response: []
        }
        const newList = [];
        // const newList = new Array(BarberShopClass);
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT
                bs.id as barberShopId, bs.name as barberShopName, bs.phone as barberShopPhone, bs.city as barberShopCity, cy.name as barberShopCityName,
                bs.neighborhood as barberShopNeighborhood, bs.street as barberShopStreet, bs.number as barberShopNumber, bs.complement barberShopComplement,
                bs.availableDays, bs.availableHours, 
                bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId as barberShopWppId
                FROM barberShop AS bs
                JOIN city AS cy ON cy.id = bs.city`,
                // [BarberShopId],
                function (err, rows, fields) {
                    if (err) reject(err);
                    // {
                    //     "id": 3,
                    //     "barberShopId": 1,
                    //     "barberShopName": "Barbearia do Gabriel",
                    //     "barberShopPhone": "",
                    //     "barberShopCity": "CZO",
                    //     "barberShopCityName": "Carazinho",
                    //     "barberShopNeighborhood": "Centro",
                    //     "barberShopStreet": "Alexandre da Motta",
                    //     "barberShopNumber": "1264",
                    //     "barberShopComplement": null,
                    //     "geolocationLatitude": "-28",
                    //     "geolocationLongitude": "-53",
                    //     "barberShopWppId": "",
                    // }
                    // Connection is automatically released when query resolves
                    if (Array.isArray(rows)) {
                        console.log('Fist row ' + JSON.stringify(rows[0], null, 4));
                        for (const row of rows) {
                            let barberShopStatus = new BarberShopClass(row);
                            newList.push(barberShopStatus);
                        }
                    }
                    resolve(newList);
                });
        });

    }

    newBarberShops(jsonData) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                throw 'Error: expected a valid JSON as argument.\n' + error;
            }
        }
        const newbarberShopsList = [];
        // const newbarberShopsList = new Array(BarberShopClass);
        if (Array.isArray(jsonData)) {
            console.log('newbarberShop Batch Input rows: ' + jsonData.length);
            console.log('newbarberShop Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const barberShopRow of jsonData) {
                const barberShop = new BarberShopClass(barberShopRow);
                const barberShopRecord = barberShop.toDatabaseRecord();
                newbarberShopsList.push(barberShopRecord);
            }
        } else {
            console.log('newbarberShop Input: ' + JSON.stringify(jsonData, null, 4));
            const barberShop = new BarberShopClass(jsonData);
            const barberShopRecord = barberShop.toDatabaseRecord();
            newbarberShopsList.push(barberShopRecord);
        }
        console.log('New barberShops: ' + JSON.stringify(newbarberShopsList, null, 4));
        return new Promise((resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newbarberShopsList.length == 0) { response.error = ['Error: empty list. Nothing to insert']; reject(response) };
            const pool = this.database.getPool();
            const newList = [];
            // const newList = new Array(BarberShopClass);
            const keys = [
                'name', 'city', 'availableDays', 'availableHours', 'neighborhood', 'street', 'number', 'complement', 'phone', 'geolocationLatitude', 'geolocationLongitude', 'wppId'
            ]
            for (const barberShop of newbarberShopsList) {
                let barberShopOrderedValues = [];
                for (const key of keys) {
                    barberShopOrderedValues.push(barberShop[key] || null);
                }
                newList.push(barberShopOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            const insertTable = 'INSERT INTO barberShop(';
            let setStatement = '';
            for (const key of keys) {
                if (keys.indexOf(key) == 0) {
                    setStatement += key;
                } else {
                    if (keys.indexOf(key) == keys.length - 1) {
                        setStatement += ', ' + key + ') VALUES ?';
                    } else {
                        setStatement += ', ' + key;
                    }
                }
            }
            const query = insertTable + setStatement;
            console.log(query);
            pool.query(
                query,
                [newList],
                function (err, rows, fields) {
                    if (err) {
                        response.error = [];
                        response.error.push(err);
                        reject(response);
                    }

                    response.response = rows;
                    response.fields = fields;
                    response.success = true;
                    resolve(response);

                })
        });
    }

    async updateBarberShops(jsonData) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a valid JSON as argument.\n' + error);
            }
        }
        const newAppointmentsList = [];
        if (Array.isArray(jsonData)) {
            console.log('newAppointment Batch Input rows: ' + jsonData.length);
            console.log('newAppointment Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const appointmentRow of jsonData) {
                const appointment = new BarberShopClass(appointmentRow);
                const appointmentRecord = appointment.toDatabaseRecord();
                newAppointmentsList.push(appointmentRecord);
            }
        } else {
            console.log('newAppointment Input: ' + JSON.stringify(jsonData, null, 4));
            const appointment = new BarberShopClass(jsonData);
            const appointmentRecord = appointment.toDatabaseRecord();
            newAppointmentsList.push(appointmentRecord);
        }
        console.log('New appointments: ' + JSON.stringify(newAppointmentsList, null, 4));

        return new Promise(async (resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newAppointmentsList.length == 0) { response.error = ['Error: empty list. Nothing to update']; reject(response) };
            const pool = this.database.getPool();
            const newList = [];
            const keys = [
                'name', 'city',
                'availableDays', 'availableHours', 
                'neighborhood', 'street', 'number', 'complement', 'phone', 'geolocationLatitude', 'geolocationLongitude', 'wppId'
            ]
            for (const appointment of newAppointmentsList) {
                let appointmentOrderedValues = [];
                for (const key of keys) {
                    appointmentOrderedValues.push(appointment[key] || null);
                }
                if (appointmentOrderedValues[appointmentOrderedValues.length - 1] == null) {
                    response.error = ['Error to update appointment. Id cannot be null. Record index: ' + newList.length - 1];
                    reject(response);
                }
                newList.push(appointmentOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            const updateTable = 'UPDATE barberShop ';
            let setStatement = 'SET ';
            for (const key of keys) {
                if (keys.indexOf(key) == 0) {
                    setStatement += key + '=?';
                } else {
                    if (keys.indexOf(key) == keys.length - 1) {
                        setStatement += ' WHERE ' + key + '=? ';
                    } else {
                        setStatement += ', ' + key + '=?';
                    }
                }
            }
            const query = updateTable + setStatement;
            console.log(query);
            console.log(...newList);

            if ([...newList].length > 1) {
                console.log([...newList].length);
                const promises = [];
                pool.getConnection(async (err, conn) => {
                    if (err) {
                        response.error = []
                        response.error.push(err);
                        reject(response);
                    }
                    const queryPromise = async (nL) => {
                        // console.log([Object.values(el)]);
                        return new Promise((resolve, reject) => {
                            const res = {
                                response: []
                            };
                            conn.query(
                                query,
                                ...[nL],
                                function (err, rows, fields) {
                                    console.log(rows);
                                    if (err) {
                                        if (!Object.keys(res).includes('error')) {
                                            res.error = [];
                                        }
                                        res.error.push(err);
                                        reject(res);
                                    } else {
                                        res.response.push(rows);
                                        // res.fields = fields;
                                        resolve(res);
                                    }
                                })
                        });
                    }
                    for await (const nL of newList) {
                        await queryPromise(nL).then(res => {
                            response.response.push(res.response[0]);
                        })
                            .catch(err => {
                                if (!Object.keys(response).includes('error')) {
                                    response.error = [];
                                }
                                response.error.push(err);
                            });
                    }
                    conn.release();
                    if (Object.keys(response).includes('error')) {
                        response.success = true;
                        reject(response);
                    } else {
                        resolve(response);
                    }
                });
            } else {
                pool.query(
                    query,
                    ...newList,
                    function (err, rows, fields) {
                        if (err) {
                            response.error = [];
                            response.error.push(err);
                            reject(response);
                        }

                        response.response = rows;
                        response.fields = fields;
                        response.success = true;
                        resolve(response);

                    })
            }
        });
        // if (typeof jsonData == 'string') {
        //     try {
        //         jsonData = JSON.parse(jsonData);
        //     } catch (error) {
        //         console.error('Error: expected a valid JSON as argument.\n' + error);
        //     }
        // }
        // const newbarberShopsList = [];
        // if (Array.isArray(jsonData)) {
        //     console.log('newbarberShop Batch Input rows: ' + jsonData.length);
        //     console.log('newbarberShop Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
        //     for (const barberShopRow of jsonData) {
        //         const barberShop = new BarberShopClass(barberShopRow);
        //         const barberShopRecord = barberShop.toDatabaseRecord();
        //         newbarberShopsList.push(barberShopRecord);
        //     }
        // } else {
        //     console.log('newbarberShop Input: ' + JSON.stringify(jsonData, null, 4));
        //     const barberShop = new BarberShopClass(jsonData);
        //     const barberShopRecord = barberShop.toDatabaseRecord();
        //     newbarberShopsList.push(barberShopRecord);
        // }
        // console.log('New barberShops: ' + JSON.stringify(newbarberShopsList, null, 4));

        // return new Promise(async (resolve, reject) => {
        //     const response = {
        //         success: false,
        //         response: []
        //     }
        //     if (newbarberShopsList.length == 0) { response.error = ['Error: empty list. Nothing to update']; reject(response) };
        //     const pool = this.database.getPool();
        //     const newList = [];
        //     // id bigint auto_increment primary key,
        //     // name varchar(150) not null, 
        //     // city varchar(5) not null,
        //     // neighborhood varchar(100) not null,
        //     // street varchar(100) not null,
        //     // number varchar(100) not null,
        //     // complement varchar(125),
        //     // phone varchar(100) unique not null,
        //     // wppId varchar(500) unique not null,
        //     // #@-28.2905353,-52.7868431
        //     // geolocationLatitude Decimal(8,6),
        //     // geolocationLongitude Decimal(9,6),
        //     // createdAt timestamp DEFAULT CURRENT_TIMESTAMP ,
        //     // modifiedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        //     const keys = [
        //         'name', 'city', 'availableDays', 'availableHours', 'neighborhood', 'street', 'number', 'complement', 'phone', 'geolocationLatitude', 'geolocationLongitude', 'wppId'
        //     ]
        //     for (const barberShop of newbarberShopsList) {
        //         let barberShopOrderedValues = [];
        //         for (const key of keys) {
        //             barberShopOrderedValues.push(barberShop[key] || null);
        //         }
        //         if (barberShopOrderedValues[barberShopOrderedValues.length - 1] == null) {
        //             response.error = ['Error to update barberShop. wppId cannot be null. Record index: ' + newList.length - 1];
        //             reject(response);
        //         }
        //         newList.push(barberShopOrderedValues);
        //     }
        //     console.log('Values >  ' + JSON.stringify(newList, null, 4));
        //     const updateTable = 'UPDATE barberShop ';
        //     let setStatement = 'SET ';
        //     for (const key of keys) {
        //         if (keys.indexOf(key) == 0) {
        //             setStatement += key + '=?';
        //         } else {
        //             if (keys.indexOf(key) == keys.length - 1) {
        //                 setStatement += ' WHERE ' + key + '=? ';
        //             } else {
        //                 setStatement += ', ' + key + '=?';
        //             }
        //         }
        //     }
        //     const query = updateTable + setStatement;
        //     console.log(query);
        //     console.log(...newList);

        //     if ([...newList].length > 1) {
        //         console.log([...newList].length);
        //         const promises = [];
        //         pool.getConnection(async (err, conn) => {
        //             if (err) {
        //                 response.error = []
        //                 response.error.push(err);
        //                 reject(response);
        //             }
        //             const queryPromise = async (nL) => {
        //                 // console.log([Object.values(el)]);
        //                 return new Promise((resolve, reject) => {
        //                     const res = {
        //                         response: []
        //                     };
        //                     conn.query(
        //                         query,
        //                         ...[nL],
        //                         function (err, rows, fields) {
        //                             console.log(rows);
        //                             if (err) {
        //                                 if (!Object.keys(res).includes('error')) {
        //                                     res.error = [];
        //                                 }
        //                                 res.error.push(err);
        //                                 reject(res);
        //                             } else {
        //                                 res.response.push(rows);
        //                                 // res.fields = fields;
        //                                 resolve(res);
        //                             }
        //                         })
        //                 });
        //             }
        //             for await (const nL of newList) {
        //                 await queryPromise(nL).then(res => {
        //                     response.response.push(res.response[0]);
        //                 })
        //                     .catch(err => {
        //                         if (!Object.keys(response).includes('error')) {
        //                             response.error = [];
        //                         }
        //                         response.error.push(err);
        //                     });
        //             }
        //             conn.release();
        //             if (Object.keys(response).includes('error')) {
        //                 reject(response);
        //             } else {
        //                 resolve(response);
        //             }
        //         });
        //     } else {
        //         pool.query(
        //             query,
        //             ...[newList],
        //             function (err, rows, fields) {
        //                 if (err) {
        //                     response.error = [];
        //                     response.error.push(err);
        //                     reject(response);
        //                 }

        //                 response.response = rows;
        //                 response.fields = fields;
        //                 resolve(response);

        //             })
        //     }
        // })
    }


    async deleteBarberShops(jsonData, authorizedWppId) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a valid JSON as argument.\n' + error);
            }
        }
        const newBarberShopsList = [];
        if (Array.isArray(jsonData)) {
            console.log('newBarberShop Batch Input rows: ' + jsonData.length);
            console.log('newBarberShop Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const BarberShopRow of jsonData) {
                const BarberShop = new BarberShopClass(BarberShopRow);
                const BarberShopRecord = BarberShop.toDatabaseRecord();
                newBarberShopsList.push(BarberShopRecord);
            }
        } else {
            console.log('newBarberShop Input: ' + JSON.stringify(jsonData, null, 4));
            const BarberShop = new BarberShopClass(jsonData);
            const BarberShopRecord = BarberShop.toDatabaseRecord();
            newBarberShopsList.push(BarberShopRecord);
        }
        console.log('New BarberShops: ' + JSON.stringify(newBarberShopsList, null, 4));

        return new Promise(async (resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newBarberShopsList.length == 0) { response.error = ['Error: empty list. Nothing to update']; reject(response) };
            const pool = this.database.getPool();
            const newList = [];
            const keys = [
                'id'
            ]
            for (const BarberShop of newBarberShopsList) {
                let BarberShopOrderedValues = [];
                BarberShopOrderedValues.push(authorizedWppId || null);
                // BarberShopOrderedValues.push(authorizedWppId || null);
                // for (const key of keys) {
                //     BarberShopOrderedValues.push(BarberShop[key] || null);
                // }
                // if (BarberShopOrderedValues[BarberShopOrderedValues.length - 1] == null) {
                //     response.error = ['Error to delete BarberShop. Id cannot be null. Record index: ' + newList.length - 1];
                //     reject(response);
                // }
                newList.push(BarberShopOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            // const updateTable = 'DELETE bsw FROM barberShop AS bs ' +
            //     'INNER JOIN barberShopWorker AS bsw ON bsw.barberShop=bs.id ';
            // // 'INNER JOIN appointments AS a ON a.barberShop=bs.id';
            // let setStatement = ' WHERE bs.wppId=? ';
            const updateTable = 'DELETE a FROM barberShop AS bs ' +
                'INNER JOIN appointment AS a ON a.barberShop=bs.id ';
            // 'INNER JOIN appointments AS a ON a.barberShop=bs.id';
            let setStatement = ' WHERE bs.wppId=? ';


            for (const key of keys) {
                if (keys.indexOf(key) == 0) {
                    // setStatement += 'bs.'+key+'=?';
                    // for (const itemStr of newList) {
                    //     if ( newList.indexOf(itemStr) > 1 )
                    //     setStatement += ',?';
                    // }
                    // setStatement += ')';
                }
                // else {'
                //     if (keys.indexOf(key) == keys.length - 1) {
                //         setStatement += ' AND ' + key + '=? ';
                //     } else {
                //         setStatement += ' AND ' + key + '=?';
                //     }
                // }
            }
            const query = updateTable + setStatement;
            console.log(query);
            console.log(...newList);

            if ([...newList].length > 1) {
                console.log([...newList].length);
                const promises = [];
                pool.getConnection(async (err, conn) => {
                    if (err) {
                        response.error = []
                        response.error.push(err);
                        reject(response);
                    }
                    const queryPromise = async (nL) => {
                        // console.log([Object.values(el)]);
                        return new Promise((resolve, reject) => {
                            const res = {
                                response: []
                            };
                            conn.query(
                                query,
                                ...[nL],
                                function (err, rows, fields) {
                                    console.log(rows);
                                    if (err) {
                                        if (!Object.keys(res).includes('error')) {
                                            res.error = [];
                                        }
                                        res.error.push(err);
                                        reject(res);
                                    } else {
                                        res.response.push(rows);
                                        // res.fields = fields;
                                        resolve(res);
                                    }
                                })
                        });
                    }
                    for await (const nL of newList) {
                        await queryPromise(nL).then(res => {
                            response.response.push(res.response[0]);
                        })
                            .catch(err => {
                                if (!Object.keys(response).includes('error')) {
                                    response.error = [];
                                }
                                response.error.push(err);
                            });
                    }
                    conn.release();
                    if (Object.keys(response).includes('error')) {
                        reject(response);
                    } else {
                        response.success = true;
                        resolve(response);
                    }
                });
            } else {
                pool.query(
                    query,
                    [newList[0]],
                    function (err, rows, fields) {
                        if (err) {
                            response.error = [];
                            response.error.push(err);
                            reject(response);
                        }

                        response.response = rows;
                        response.fields = fields;

                        // const updateTable2 = 'DELETE a FROM barberShop AS bs ' +
                        //     'INNER JOIN appointment AS a ON a.barberShop=bs.id ';
                        // // 'INNER JOIN appointments AS a ON a.barberShop=bs.id';
                        // let setStatement2 = ' WHERE bs.wppId=? ';

                        const updateTable2 = 'DELETE s FROM barberShop AS bs ' +
                            'INNER JOIN barberShopWorkerService AS s ON s.barberShop=bs.id ';
                        // 'INNER JOIN appointments AS a ON a.barberShop=bs.id';
                        let setStatement2 = ' WHERE bs.wppId=? ';

                        const query2 = updateTable2 + setStatement2;

                        pool.query(
                            query2,
                            [newList[0]],
                            function (err, rows, fields) {

                                if (err) {
                                    response.error = [];
                                    response.error.push(err);
                                    reject(response);
                                }

                                response.response = rows;
                                response.fields = fields;
                                // resolve(response);

                                const updateTable3 = 'DELETE bsw FROM barberShop AS bs ' +
                                    'INNER JOIN barberShopWorker AS bsw ON bsw.barberShop=bs.id ';
                                // 'INNER JOIN appointments AS a ON a.barberShop=bs.id';
                                let setStatement3 = ' WHERE bs.wppId=? ';
                                const query3 = updateTable3 + setStatement3;

                                pool.query(
                                    query3,
                                    [newList[0]],
                                    function (err, rows, fields) {
                                        if (err) {
                                            response.error = [];
                                            response.error.push(err);
                                            reject(response);
                                        }

                                        response.response = rows;
                                        response.fields = fields;
                                        // resolve(response);

                                        const updateTable4 = 'DELETE bs FROM barberShop AS bs ';
                                        // 'INNER JOIN appointment AS a ON a.barberShop=bs.id ';
                                        // 'INNER JOIN appointments AS a ON a.barberShop=bs.id';
                                        let setStatement4 = ' WHERE bs.wppId=? ';
                                        const query4 = updateTable4 + setStatement4;

                                        pool.query(
                                            query4,
                                            [newList[0]],
                                            function (err, rows, fields) {
                                                if (err) {
                                                    response.error = [];
                                                    response.error.push(err);
                                                    reject(response);
                                                }

                                                response.response = rows;
                                                response.fields = fields;
                                                response.success = true;
                                                resolve(response);

                                                // const updateTable3 = 'DELETE bs FROM barberShop AS bs ';

                                                // let setStatement3 = ' WHERE bs.wppId=? ';

                                                // const query3 = updateTable3 + setStatement3;


                                            })
                                        // resolve(response);

                                    })

                            })
                        // resolve(response);

                    })
            }
        })
    }


}

module.exports.BarberShopService = new BarberShopService();