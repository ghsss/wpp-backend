const { BarberShopWorkerClass } = require("../models/BarberShopWorker");
const { DatabaseService } = require("./DatabaseService");

class BarberShopWorkerService {

    database = DatabaseService;
    #selectedBarberShopWorker = BarberShopWorkerClass;
    #BarberShopWorkerList = new Array(BarberShopWorkerClass);

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

    async getBarberShopWorkersByWppId(BarberShopWorkerWppId) {
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
                bsw.id, bsw.barberShop, bsw.worker
                FROM barberShopWorker AS bsw
                WHERE bsw.worker = ?`,
                [BarberShopWorkerWppId],
                function (err, rows, fields) {
                    if (err) reject(err);
                    // {
                    //     "id": 3,
                    //     "dayAndTime": "2023-08-08T04:46:46.000Z",
                    //     "createdBy": null,
                    //     "BarberShopWorkerStatus": "Agendado",
                    //     "modifiedBy": null,
                    //     "createdAt": "2023-08-08T04:46:46.000Z",
                    //     "modifiedAt": "2023-08-08T04:46:46.000Z",
                    //     "BarberShopWorkerId": "555499026453@bsw.us",
                    //     "BarberShopWorkerName": "Gabriel",
                    //     "BarberShopWorkerPhone": "555499026453",
                    //     "BarberShopWorkerId": 1,
                    //     "BarberShopWorkerName": "Barbearia do Gabriel",
                    //     "BarberShopWorkerPhone": "",
                    //     "BarberShopWorkerCity": "CZO",
                    //     "BarberShopWorkerCityName": "Carazinho",
                    //     "BarberShopWorkerNeighborhood": "Centro",
                    //     "BarberShopWorkerStreet": "Alexandre da Motta",
                    //     "BarberShopWorkerNumber": "1264",
                    //     "BarberShopWorkerComplement": null,
                    //     "geolocationLatitude": "-28",
                    //     "geolocationLongitude": "-53",
                    //     "BarberShopWorkerWppId": "",
                    //     "workerId": "555499026453@bsw.us",
                    //     "workerName": "Gabriel",
                    //     "workerPhone": "555499026453"
                    // }
                    // Connection is automatically released when query resolves
                    if (Array.isArray(rows)) {
                        console.log('Fist row ' + JSON.stringify(rows[0], null, 4));
                        for (const row of rows) {
                            let BarberShopWorkerStatus = new BarberShopWorkerClass(row);
                            newList.push(BarberShopWorkerStatus);
                        }
                    }
                    console.log('List: ' + JSON.stringify(newList));
                    resolve(newList);
                });
        });

    }

    getBarberShopWorkers(BarberShopId) {
        const pool = this.database.getPool();
        const response = {
            success: false,
            response: []
        }
        const newList = [];
        // const newList = new Array(BarberShopWorkerClass);
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT 
                bsw.id, bsw.barberShop, bsw.worker
                FROM barberShopWorker AS bsw
                JOIN barberShop as bs ON bsw.barberShop = bs.id
                WHERE bs.wppId = ?`,
                [BarberShopId],
                function (err, rows, fields) {
                    if (err) reject(err);
                    // {
                    //     "id": 3,
                    //     "BarberShopWorkerId": 1,
                    //     "BarberShopWorkerName": "Barbearia do Gabriel",
                    //     "BarberShopWorkerPhone": "",
                    //     "BarberShopWorkerCity": "CZO",
                    //     "BarberShopWorkerCityName": "Carazinho",
                    //     "BarberShopWorkerNeighborhood": "Centro",
                    //     "BarberShopWorkerStreet": "Alexandre da Motta",
                    //     "BarberShopWorkerNumber": "1264",
                    //     "BarberShopWorkerComplement": null,
                    //     "geolocationLatitude": "-28",
                    //     "geolocationLongitude": "-53",
                    //     "BarberShopWorkerWppId": "",
                    // }
                    // Connection is automatically released when query resolves
                    if (Array.isArray(rows)) {
                        console.log('Fist row ' + JSON.stringify(rows[0], null, 4));
                        for (const row of rows) {
                            let BarberShopWorkerStatus = new BarberShopWorkerClass(row);
                            newList.push(BarberShopWorkerStatus);
                        }
                    }
                    resolve(newList);
                });
        });

    }

    newBarberShopWorkers(jsonData) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                throw 'Error: expected a valid JSON as argument.\n' + error;
            }
        }
        const newBarberShopWorkersList = [];
        // const newBarberShopWorkersList = new Array(BarberShopWorkerClass);
        if (Array.isArray(jsonData)) {
            console.log('newBarberShopWorker Batch Input rows: ' + jsonData.length);
            console.log('newBarberShopWorker Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const BarberShopWorkerRow of jsonData) {
                const BarberShopWorker = new BarberShopWorkerClass(BarberShopWorkerRow);
                const BarberShopWorkerRecord = BarberShopWorker.toDatabaseRecord();
                newBarberShopWorkersList.push(BarberShopWorkerRecord);
            }
        } else {
            console.log('newBarberShopWorker Input: ' + JSON.stringify(jsonData, null, 4));
            const BarberShopWorker = new BarberShopWorkerClass(jsonData);
            const BarberShopWorkerRecord = BarberShopWorker.toDatabaseRecord();
            newBarberShopWorkersList.push(BarberShopWorkerRecord);
        }
        console.log('New BarberShopWorkers: ' + JSON.stringify(newBarberShopWorkersList, null, 4));
        return new Promise((resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newBarberShopWorkersList.length == 0) { response.error = ['Error: empty list. Nothing to insert']; reject(response) };
            const pool = this.database.getPool();
            const newList = [];
            // const newList = new Array(BarberShopWorkerClass);
            const keys = [
                'barberShop', 'worker'
            ]
            for (const BarberShopWorker of newBarberShopWorkersList) {
                let BarberShopWorkerOrderedValues = [];
                for (const key of keys) {
                    BarberShopWorkerOrderedValues.push(BarberShopWorker[key] || null);
                }
                newList.push(BarberShopWorkerOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            const insertTable = 'INSERT INTO barberShopWorker(';
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

    async updateBarberShopWorkers(jsonData, authorizedWppId) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a valid JSON as argument.\n' + error);
            }
        }
        const newBarberShopWorkersList = [];
        if (Array.isArray(jsonData)) {
            console.log('newBarberShopWorker Batch Input rows: ' + jsonData.length);
            console.log('newBarberShopWorker Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const BarberShopWorkerRow of jsonData) {
                const BarberShopWorker = new BarberShopWorkerClass(BarberShopWorkerRow);
                const BarberShopWorkerRecord = BarberShopWorker.toDatabaseRecord();
                newBarberShopWorkersList.push(BarberShopWorkerRecord);
            }
        } else {
            console.log('newBarberShopWorker Input: ' + JSON.stringify(jsonData, null, 4));
            const BarberShopWorker = new BarberShopWorkerClass(jsonData);
            const BarberShopWorkerRecord = BarberShopWorker.toDatabaseRecord();
            newBarberShopWorkersList.push(BarberShopWorkerRecord);
        }
        console.log('New BarberShopWorkers: ' + JSON.stringify(newBarberShopWorkersList, null, 4));

        return new Promise(async (resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newBarberShopWorkersList.length == 0) { response.error = ['Error: empty list. Nothing to update']; reject(response) };
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
                'barberShop', 'worker', 'id'
            ]
            for (const BarberShopWorker of newBarberShopWorkersList) {
                let BarberShopWorkerOrderedValues = [];
                for (const key of keys) {
                    BarberShopWorkerOrderedValues.push(BarberShopWorker[key] || null);
                }
                if (BarberShopWorkerOrderedValues[BarberShopWorkerOrderedValues.length - 1] == null) {
                    response.error = ['Error to update BarberShopWorker. wppId cannot be null. Record index: ' + newList.length - 1];
                    reject(response);
                }
                BarberShopWorkerOrderedValues.push(authorizedWppId || null);
                BarberShopWorkerOrderedValues.push(authorizedWppId || null);
                newList.push(BarberShopWorkerOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            const updateTable = 'UPDATE barberShopWorker as bsw INNER JOIN barberShop as bs ON bsw.barberShop = bs.id ';
            let setStatement =  'SET ';
            for (const key of keys) {
                if (keys.indexOf(key) == 0) {
                    setStatement += 'bsw.'+key+'=?';
                } else {
                    if (keys.indexOf(key) == keys.length - 1) {
                        // ADICIONAR SEGUNDO PARAMETRO wppId NO METODO updateBarberShopWorkers 
                        // E CONDICAO NA CLAUSULA WHERE SE BARBER ID = WPPID OU BARBERSHOP.WPPID = WPPID
                        // PARA PERMITIR SOMENTE ATUALIZAR O REGISTRO SE FOR A BARBEARIA OU O BARBEIRO VINCULADO AO ID
                        setStatement += ' WHERE bsw.'+key+'=? AND ( bsw.worker=? OR bs.wppId=? )';
                    } else {
                        setStatement += ', bsw.'+key+'=?';
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
                        response.success = true;
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
        })
    }

    async deleteBarberShopWorkers(jsonData, authorizedWppId) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a valid JSON as argument.\n' + error);
            }
        }
        const newBarberShopWorkersList = [];
        if (Array.isArray(jsonData)) {
            console.log('newBarberShopWorker Batch Input rows: ' + jsonData.length);
            console.log('newBarberShopWorker Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const BarberShopWorkerRow of jsonData) {
                const BarberShopWorker = new BarberShopWorkerClass(BarberShopWorkerRow);
                const BarberShopWorkerRecord = BarberShopWorker.toDatabaseRecord();
                newBarberShopWorkersList.push(BarberShopWorkerRecord);
            }
        } else {
            console.log('newBarberShopWorker Input: ' + JSON.stringify(jsonData, null, 4));
            const BarberShopWorker = new BarberShopWorkerClass(jsonData);
            const BarberShopWorkerRecord = BarberShopWorker.toDatabaseRecord();
            newBarberShopWorkersList.push(BarberShopWorkerRecord);
        }
        console.log('New BarberShopWorkers: ' + JSON.stringify(newBarberShopWorkersList, null, 4));

        return new Promise(async (resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newBarberShopWorkersList.length == 0) { response.error = ['Error: empty list. Nothing to update']; reject(response) };
            const pool = this.database.getPool();
            const newList = [];
            const keys = [
                'id'
            ]
            for (const BarberShopWorker of newBarberShopWorkersList) {
                let BarberShopWorkerOrderedValues = [];
                BarberShopWorkerOrderedValues.push(authorizedWppId || null);
                BarberShopWorkerOrderedValues.push(authorizedWppId || null);
                for (const key of keys) {
                    BarberShopWorkerOrderedValues.push(BarberShopWorker[key] || null);
                }
                if (BarberShopWorkerOrderedValues[BarberShopWorkerOrderedValues.length - 1] == null) {
                    response.error = ['Error to delete BarberShopWorker. Id cannot be null. Record index: ' + newList.length - 1];
                    reject(response);
                }
                newList.push(BarberShopWorkerOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            const updateTable = 'DELETE bsw FROM barberShopWorker AS bsw LEFT JOIN barberShop AS bs ON bs.id = bsw.barberShop ';
            let setStatement = ' WHERE (bsw.worker=? OR bs.wppId=?) AND ';
            for (const key of keys) {
                if (keys.indexOf(key) == 0) {
                    setStatement += 'bsw.'+key+'=?';
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
                pool.getConnection( async (err, conn) => {
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
                        await queryPromise(nL).then( res => {
                            response.response.push(res.response[0]);
                        })
                        .catch( err => {
                            if ( !Object.keys(response).includes('error') ) {
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
        })
    }

}

module.exports.BarberShopWorkerService = new BarberShopWorkerService();