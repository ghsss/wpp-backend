// const databaseRecordPropsDict = {
//     'service': 'name', 'serviceDescription': 'description', 'serviceDurationInMinutes': 'durationInMinutes',
//     'availableDays': 'availableDays', 'availableHours': 'availableHours', 'barberShopId': 'barberShop',
//     'workerId': 'barberShopWorker'
// }
const { BarberShopWorkerServiceClass } = require("../models/BarberShopWorkerService");
// const { BarberShopStatusService } = require("./BarberShopStatusService");
const { DatabaseService } = require("./DatabaseService");

class BarberShopWorkerServiceService {

    database = DatabaseService;
    // #selectedbarberShop = BarberShopWorkerServiceClass;
    // #barberShopList = new Array(BarberShopWorkerServiceClass);

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

    async getBarberShopServices(barberShopWppId) {
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
                a.id, a.name, a.description, a.durationInMinutes, a.availableDays, a.availableHours,
                bs.id as barberShopId, bs.name as barberShopName, bs.phone as barberShopPhone, bs.city as barberShopCity, cy.name as barberShopCityName, 
                bs.neighborhood as barberShopNeighborhood, bs.street as barberShopStreet, bs.number as barberShopNumber, bs.complement barberShopComplement, 
                bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId as barberShopWppId,
                b.id AS workerWppId, b.name AS workerName, b.phone AS workerPhone, bsw.id AS workerId 
                FROM barberShopWorkerService AS a 
                JOIN barberShop AS bs ON a.barberShop = bs.id 
                JOIN barberShopWorker AS bsw ON a.barberShopWorker = bsw.id 
                JOIN barber AS b ON b.id = bsw.worker
                JOIN city AS cy ON cy.id = bs.city 
                WHERE bs.wppId = ?`,
                [barberShopWppId],
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
                    //     "customerId": "555499026453@c.us",
                    //     "customerName": "Gabriel",
                    //     "customerPhone": "555499026453",
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
                            let barberShopStatus = new BarberShopWorkerServiceClass(row);
                            newList.push(barberShopStatus);
                        }
                    }
                    console.log('List: ' + JSON.stringify(newList));
                    resolve(newList);
                });
        });

    }

    newBarberShopWorkerServices(jsonData) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                throw 'Error: expected a valid JSON as argument.\n' + error;
            }
        }
        const newbarberShopWorkerServicesList = [];
        // const newbarberShopWorkerServicesList = new Array(BarberShopWorkerServiceClass);
        if (Array.isArray(jsonData)) {
            console.log('barberShopWorkerService Batch Input rows: ' + jsonData.length);
            console.log('barberShopWorkerService Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const barberShopRow of jsonData) {
                const barberShop = new BarberShopWorkerServiceClass(barberShopRow);
                const barberShopRecord = barberShop.toDatabaseRecord();
                newbarberShopWorkerServicesList.push(barberShopRecord);
            }
        } else {
            console.log('barberShopWorkerService Input: ' + JSON.stringify(jsonData, null, 4));
            const barberShop = new BarberShopWorkerServiceClass(jsonData);
            const barberShopRecord = barberShop.toDatabaseRecord();
            newbarberShopWorkerServicesList.push(barberShopRecord);
        }
        console.log('New barberShopWorkerService: ' + JSON.stringify(newbarberShopWorkerServicesList, null, 4));
        return new Promise((resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newbarberShopWorkerServicesList.length == 0) { response.error = ['Error: empty list. Nothing to insert']; reject(response) };
            const pool = this.database.getPool();
            const newList = [];
            // id bigint auto_increment primary key,
            // name varchar(250) not null,
            // description varchar(500),
            // durationInMinutes int not null,
            // availableDays varchar(500) not null, # [0,1,2,3,4,5,6]
            // availableHours varchar(1000) not null, # [{"0":["7:30 12:00","13:30 18:00"]}]
            // barberShop bigint not null,
            // barberShopWorker bigint not null,
            const keys = [
                'name', 'description', 'durationInMinutes', 'availableDays', 'availableHours', 'barberShop', 'barberShopWorker'
            ]
            for (const barberShop of newbarberShopWorkerServicesList) {
                let barberShopOrderedValues = [];
                for (const key of keys) {
                    barberShopOrderedValues.push(barberShop[key] || null);
                }
                newList.push(barberShopOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            const insertTable = 'INSERT INTO barberShopWorkerService(';
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
        const newbarberShopWorkerServicesList = [];
        if (Array.isArray(jsonData)) {
            console.log('barberShopWorkerService Batch Input rows: ' + jsonData.length);
            console.log('barberShopWorkerService Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const barberShopRow of jsonData) {
                const barberShop = new BarberShopWorkerServiceClass(barberShopRow);
                const barberShopRecord = barberShop.toDatabaseRecord();
                newbarberShopWorkerServicesList.push(barberShopRecord);
            }
        } else {
            console.log('barberShopWorkerService Input: ' + JSON.stringify(jsonData, null, 4));
            const barberShop = new BarberShopWorkerServiceClass(jsonData);
            const barberShopRecord = barberShop.toDatabaseRecord();
            newbarberShopWorkerServicesList.push(barberShopRecord);
        }
        console.log('New barberShopWorkerService: ' + JSON.stringify(newbarberShopWorkerServicesList, null, 4));

        return new Promise(async (resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newbarberShopWorkerServicesList.length == 0) { response.error = ['Error: empty list. Nothing to update']; reject(response) };
            const pool = this.database.getPool();
            const newList = [];
            // id bigint auto_increment primary key,
            // name varchar(150) not null, 
            // city varchar(5) not null,
            // neighborhood varchar(100) not null,
            // street varchar(100) not null,
            // number varchar(100) not null,
            // complement varchar(125),
            // phone varchar(100) unique not null,
            // wppId varchar(500) unique not null,
            // #@-28.2905353,-52.7868431
            // geolocationLatitude Decimal(8,6),
            // geolocationLongitude Decimal(9,6),
            // createdAt timestamp DEFAULT CURRENT_TIMESTAMP ,
            // modifiedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            const keys = [
                'name', 'description', 'durationInMinutes', 'availableDays', 'availableHours', 'barberShop', 'barberShopWorker', 'id'
            ]
            for (const barberShop of newbarberShopWorkerServicesList) {
                let barberShopOrderedValues = [];
                for (const key of keys) {
                    barberShopOrderedValues.push(barberShop[key] || null);
                }
                if (barberShopOrderedValues[barberShopOrderedValues.length - 1] == null) {
                    response.error = ['Error to update barberShopWorkerService. wppId cannot be null. Record index: ' + newList.length - 1];
                    reject(response);
                }
                newList.push(barberShopOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            const updateTable = 'UPDATE barberShopWorkerService ';
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
                        reject(response);
                    } else {
                        resolve(response);
                    }
                });
            } else {
                pool.query(
                    query,
                    ...[newList],
                    function (err, rows, fields) {
                        if (err) {
                            response.error = [];
                            response.error.push(err);
                            reject(response);
                        }

                        response.response = rows;
                        response.fields = fields;
                        resolve(response);

                    })
            }
        })
    }

}

module.exports.BarberShopWorkerServiceService = new BarberShopWorkerServiceService();