const { BarberClass } = require("../models/Barber");
const { DatabaseService } = require("./DatabaseService");

class BarberService {

    database = DatabaseService;
    #selectedBarber = BarberClass;
    #BarberList = new Array(BarberClass);

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

    async getBarbers(BarberWppId) {
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
                c.id AS barberId, c.name AS barberName, c.phone as barberPhone
                FROM barber AS c`,
                // [BarberWppId, 'Agendado'],
                function (err, rows, fields) {
                    if (err) reject(err);
                    // {
                    //     "id": 3,
                    //     "dayAndTime": "2023-08-08T04:46:46.000Z",
                    //     "createdBy": null,
                    //     "BarberStatus": "Agendado",
                    //     "modifiedBy": null,
                    //     "createdAt": "2023-08-08T04:46:46.000Z",
                    //     "modifiedAt": "2023-08-08T04:46:46.000Z",
                    //     "BarberId": "555499026453@c.us",
                    //     "BarberName": "Gabriel",
                    //     "BarberPhone": "555499026453",
                    //     "BarberId": 1,
                    //     "BarberName": "Barbearia do Gabriel",
                    //     "BarberPhone": "",
                    //     "BarberCity": "CZO",
                    //     "BarberCityName": "Carazinho",
                    //     "BarberNeighborhood": "Centro",
                    //     "BarberStreet": "Alexandre da Motta",
                    //     "BarberNumber": "1264",
                    //     "BarberComplement": null,
                    //     "geolocationLatitude": "-28",
                    //     "geolocationLongitude": "-53",
                    //     "BarberWppId": "",
                    //     "workerId": "555499026453@c.us",
                    //     "workerName": "Gabriel",
                    //     "workerPhone": "555499026453"
                    // }
                    // Connection is automatically released when query resolves
                    if (Array.isArray(rows)) {
                        console.log('Fist row ' + JSON.stringify(rows[0], null, 4));
                        for (const row of rows) {
                            let BarberStatus = new BarberClass(row);
                            newList.push(BarberStatus);
                        }
                    }
                    console.log('List: ' + JSON.stringify(newList));
                    resolve(newList);
                });
        });

    }

    getBarbers() {
        const pool = this.database.getPool();
        const response = {
            success: false,
            response: []
        }
        const newList = [];
        // const newList = new Array(BarberClass);
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT 
                c.id AS barberId, c.name AS barberName, c.phone as barberPhone
                FROM barber AS c`,
                // [BarberId],
                function (err, rows, fields) {
                    if (err) reject(err);
                    // {
                    //     "id": 3,
                    //     "BarberId": 1,
                    //     "BarberName": "Barbearia do Gabriel",
                    //     "BarberPhone": "",
                    //     "BarberCity": "CZO",
                    //     "BarberCityName": "Carazinho",
                    //     "BarberNeighborhood": "Centro",
                    //     "BarberStreet": "Alexandre da Motta",
                    //     "BarberNumber": "1264",
                    //     "BarberComplement": null,
                    //     "geolocationLatitude": "-28",
                    //     "geolocationLongitude": "-53",
                    //     "BarberWppId": "",
                    // }
                    // Connection is automatically released when query resolves
                    if (Array.isArray(rows)) {
                        console.log('Fist row ' + JSON.stringify(rows[0], null, 4));
                        for (const row of rows) {
                            let BarberStatus = new BarberClass(row);
                            newList.push(BarberStatus);
                        }
                    }
                    resolve(newList);
                });
        });

    }

    newBarbers(jsonData) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                throw 'Error: expected a valid JSON as argument.\n' + error;
            }
        }
        const newBarbersList = [];
        // const newBarbersList = new Array(BarberClass);
        if (Array.isArray(jsonData)) {
            console.log('newBarber Batch Input rows: ' + jsonData.length);
            console.log('newBarber Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const BarberRow of jsonData) {
                const Barber = new BarberClass(BarberRow);
                const BarberRecord = Barber.toDatabaseRecord();
                newBarbersList.push(BarberRecord);
            }
        } else {
            console.log('newBarber Input: ' + JSON.stringify(jsonData, null, 4));
            const Barber = new BarberClass(jsonData);
            const BarberRecord = Barber.toDatabaseRecord();
            newBarbersList.push(BarberRecord);
        }
        console.log('New Barbers: ' + JSON.stringify(newBarbersList, null, 4));
        return new Promise((resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newBarbersList.length == 0) { response.error = ['Error: empty list. Nothing to insert']; reject(response) };
            const pool = this.database.getPool();
            const newList = [];
            // const newList = new Array(BarberClass);
            const keys = [
                'id', 'name', 'phone'
            ]
            for (const Barber of newBarbersList) {
                let BarberOrderedValues = [];
                for (const key of keys) {
                    BarberOrderedValues.push(Barber[key] || null);
                }
                newList.push(BarberOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            const insertTable = 'INSERT INTO barber(';
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

    async updateBarbers(jsonData) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a valid JSON as argument.\n' + error);
            }
        }
        const newBarbersList = [];
        if (Array.isArray(jsonData)) {
            console.log('newBarber Batch Input rows: ' + jsonData.length);
            console.log('newBarber Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const BarberRow of jsonData) {
                const Barber = new BarberClass(BarberRow);
                const BarberRecord = Barber.toDatabaseRecord();
                newBarbersList.push(BarberRecord);
            }
        } else {
            console.log('newBarber Input: ' + JSON.stringify(jsonData, null, 4));
            const Barber = new BarberClass(jsonData);
            const BarberRecord = Barber.toDatabaseRecord();
            newBarbersList.push(BarberRecord);
        }
        console.log('New Barbers: ' + JSON.stringify(newBarbersList, null, 4));

        return new Promise(async (resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newBarbersList.length == 0) { response.error = ['Error: empty list. Nothing to update']; reject(response) };
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
                'name', 'phone', 'id'
            ]
            for (const Barber of newBarbersList) {
                let BarberOrderedValues = [];
                for (const key of keys) {
                    BarberOrderedValues.push(Barber[key] || null);
                }
                if (BarberOrderedValues[BarberOrderedValues.length - 1] == null) {
                    response.error = ['Error to update Barber. wppId cannot be null. Record index: ' + newList.length - 1];
                    reject(response);
                }
                newList.push(BarberOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            const updateTable = 'UPDATE barber ';
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
                    ...newList,
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

module.exports.BarberService = new BarberService();