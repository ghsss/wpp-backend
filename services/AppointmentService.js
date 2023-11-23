const { AppointmentClass } = require("../models/Appointment");
const { AppointmentStatusService } = require("./AppointmentStatusService");
const { DatabaseService } = require("./DatabaseService");

class AppointmentService {

    database = DatabaseService;
    #selectedAppointment = AppointmentClass;
    #appointmentList = new Array(AppointmentClass);

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

    getBarberShopWorkerAppointmentsByDate(workerId, date) {
        console.log('getBarberShopWorkerAppointmentsByDate called');
        const pool = this.database.getPool();
        const response = {
            success: false,
            response: []
        }
        const newList = [];
        // const newList = new Array(AppointmentClass);
        date = '%'+date+'%';
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT 
                a.id, a.dayAndTime, a.createdBy, a.modifiedBy, a.createdAt, a.modifiedAt, a.appointmentStatus, a.service, 
                c.id AS customerId, c.name AS customerName, c.phone as customerPhone,
                bs.id as barberShopId, bs.name as barberShopName, bs.phone as barberShopPhone, bs.city as barberShopCity, cy.name as barberShopCityName, 
                bs.neighborhood as barberShopNeighborhood, bs.street as barberShopStreet, bs.number as barberShopNumber, bs.complement barberShopComplement, 
                bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId as barberShopWppId,
                b.id AS workerWppId, b.name AS workerName, b.phone AS workerPhone, bsw.id AS workerId,
                s.name AS serviceName, s.durationInMinutes, s.price AS servicePrice
                FROM appointment AS a 
                JOIN barberShop AS bs ON a.barberShop = bs.id 
                JOIN barberShopWorker AS bsw ON a.barberShopWorker = bsw.id 
                JOIN barber AS b ON b.id = bsw.worker
                LEFT JOIN customer AS c ON c.id = a.customer
                JOIN city AS cy ON cy.id = bs.city 
                JOIN barberShopWorkerService AS s ON a.service = s.id
                WHERE bsw.id = ? AND a.dayAndTime LIKE ?`,
                [workerId, date],
                function (err, rows, fields) {
                    if (err) reject(err);
                    // {
                    //     "id": 3,
                    //     "dayAndTime": "2023-08-08T04:46:46.000Z",
                    //     "createdBy": null,
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
                            let appointmentStatus = new AppointmentClass(row);
                            newList.push(appointmentStatus);
                        }
                    }
                    resolve(newList);
                });
        });
    }

    async getBarberShopAppointments(barberShopWppId) {
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
                a.id, a.dayAndTime, a.createdBy, a.modifiedBy, a.createdAt, a.modifiedAt, a.appointmentStatus, a.service, 
                c.id AS customerId, c.name AS customerName, c.phone as customerPhone,
                bs.id as barberShopId, bs.name as barberShopName, bs.phone as barberShopPhone, bs.city as barberShopCity, cy.name as barberShopCityName, 
                bs.neighborhood as barberShopNeighborhood, bs.street as barberShopStreet, bs.number as barberShopNumber, bs.complement barberShopComplement, 
                bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId as barberShopWppId,
                b.id AS workerWppId, b.name AS workerName, b.phone AS workerPhone, bsw.id AS workerId,
                s.name AS serviceName, s.durationInMinutes, s.price AS servicePrice
                FROM appointment AS a
                JOIN barberShop AS bs ON a.barberShop = bs.id 
                JOIN barberShopWorker AS bsw ON a.barberShopWorker = bsw.id 
                JOIN barber AS b ON b.id = bsw.worker
                LEFT JOIN customer AS c ON c.id = a.customer
                JOIN city AS cy ON cy.id = bs.city
                JOIN barberShopWorkerService AS s ON a.service = s.id
                WHERE bs.wppId = ? AND a.appointmentStatus = ?`,
                [barberShopWppId, 'Agendado'],
                function (err, rows, fields) {
                    if (err) reject(err);
                    // {
                    //     "id": 3,
                    //     "dayAndTime": "2023-08-08T04:46:46.000Z",
                    //     "createdBy": null,
                    //     "appointmentStatus": "Agendado",
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
                            let appointmentStatus = new AppointmentClass(row);
                            newList.push(appointmentStatus);
                        }
                    }
                    console.log('List: ' + JSON.stringify(newList));
                    resolve(newList);
                });
        });

    }

    getCustomerAppointments(customerId) {
        const pool = this.database.getPool();
        const response = {
            success: false,
            response: []
        }
        const newList = [];
        // const newList = new Array(AppointmentClass);
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT 
                a.id, a.dayAndTime, a.createdBy, a.modifiedBy, a.createdAt, a.modifiedAt, a.appointmentStatus, a.service, 
                c.id AS customerId, c.name AS customerName, c.phone as customerPhone,
                bs.id as barberShopId, bs.name as barberShopName, bs.phone as barberShopPhone, bs.city as barberShopCity, cy.name as barberShopCityName, 
                bs.neighborhood as barberShopNeighborhood, bs.street as barberShopStreet, bs.number as barberShopNumber, bs.complement barberShopComplement, 
                bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId as barberShopWppId,
                b.id AS workerWppId, b.name AS workerName, b.phone AS workerPhone, bsw.id AS workerId,
                s.name AS serviceName, s.durationInMinutes, s.price AS servicePrice
                FROM appointment AS a 
                JOIN barberShop AS bs ON a.barberShop = bs.id OR a.createdBy = bs.wppId  
                JOIN barberShopWorker AS bsw ON a.barberShopWorker = bsw.id 
                JOIN barber AS b ON b.id = bsw.worker OR a.createdBy = b.id  
                JOIN customer AS c ON c.id = a.customer OR a.createdBy = c.id  
                JOIN city AS cy ON cy.id = bs.city
                JOIN barberShopWorkerService AS s ON a.service = s.id
                WHERE customer = ? ORDER BY a.dayAndTime DESC`,
                [customerId],
                function (err, rows, fields) {
                    if (err) reject(err);
                    // {
                    //     "id": 3,
                    //     "dayAndTime": "2023-08-08T04:46:46.000Z",
                    //     "createdBy": null,
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
                            let appointmentStatus = new AppointmentClass(row);
                            newList.push(appointmentStatus);
                        }
                    }
                    resolve(newList);
                });
        });

    }

    getBarberShopWorkerAppointments(workerId, barberShop) {
        const pool = this.database.getPool();
        const response = {
            success: false,
            response: []
        }
        const newList = [];
        // const newList = new Array(AppointmentClass);
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT 
                a.id, a.dayAndTime, a.createdBy, a.modifiedBy, a.createdAt, a.modifiedAt, a.appointmentStatus, a.service, 
                c.id AS customerId, c.name AS customerName, c.phone as customerPhone,
                bs.id as barberShopId, bs.name as barberShopName, bs.phone as barberShopPhone, bs.city as barberShopCity, cy.name as barberShopCityName, 
                bs.neighborhood as barberShopNeighborhood, bs.street as barberShopStreet, bs.number as barberShopNumber, bs.complement barberShopComplement, 
                bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId as barberShopWppId,
                b.id AS workerWppId, b.name AS workerName, b.phone AS workerPhone, bsw.id AS workerId,
                s.name AS serviceName, s.durationInMinutes, s.price AS servicePrice
                FROM appointment AS a 
                JOIN barberShop AS bs ON a.barberShop = bs.id 
                JOIN barberShopWorker AS bsw ON a.barberShopWorker = bsw.id 
                JOIN barber AS b ON b.id = bsw.worker
                LEFT JOIN customer AS c ON c.id = a.customer
                JOIN city AS cy ON cy.id = bs.city 
                JOIN barberShopWorkerService AS s ON a.service = s.id
                WHERE b.id = ? AND bs.id = ?`,
                [workerId, barberShop],
                function (err, rows, fields) {
                    if (err) reject(err);
                    // {
                    //     "id": 3,
                    //     "dayAndTime": "2023-08-08T04:46:46.000Z",
                    //     "createdBy": null,
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
                            let appointmentStatus = new AppointmentClass(row);
                            newList.push(appointmentStatus);
                        }
                    }
                    resolve(newList);
                });
        });

    }

    newAppointments(jsonData) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                throw 'Error: expected a valid JSON as argument.\n' + error;
            }
        }
        const newAppointmentsList = [];
        // const newAppointmentsList = new Array(AppointmentClass);
        if (Array.isArray(jsonData)) {
            console.log('newAppointment Batch Input rows: ' + jsonData.length);
            console.log('newAppointment Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const appointmentRow of jsonData) {
                const appointment = new AppointmentClass(appointmentRow);
                const appointmentRecord = appointment.toDatabaseRecord();
                newAppointmentsList.push(appointmentRecord);
            }
        } else {
            console.log('newAppointment Input: ' + JSON.stringify(jsonData, null, 4));
            const appointment = new AppointmentClass(jsonData);
            const appointmentRecord = appointment.toDatabaseRecord();
            newAppointmentsList.push(appointmentRecord);
        }
        console.log('New appointments: ' + JSON.stringify(newAppointmentsList, null, 4));
        return new Promise((resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newAppointmentsList.length == 0) { response.error = ['Error: empty list. Nothing to insert']; reject(response) };
            const pool = this.database.getPool();
            const newList = [];
            // const newList = new Array(AppointmentClass);
            const keys = [
                'dayAndTime', 'createdBy', 'modifiedBy', 'appointmentStatus', 'customer', 'barberShop', 'barberShopWorker', 'service'
            ]
            for (const appointment of newAppointmentsList) {
                let appointmentOrderedValues = [];
                for (const key of keys) {
                    appointmentOrderedValues.push(appointment[key] || null);
                }
                newList.push(appointmentOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            pool.query(
                `INSERT INTO appointment(dayAndTime, createdBy, modifiedBy, appointmentStatus, customer, barberShop, barberShopWorker, service) 
                 VALUES ?`,
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

    async updateAppointments(jsonData) {
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
                const appointment = new AppointmentClass(appointmentRow);
                const appointmentRecord = appointment.toDatabaseRecord();
                newAppointmentsList.push(appointmentRecord);
            }
        } else {
            console.log('newAppointment Input: ' + JSON.stringify(jsonData, null, 4));
            const appointment = new AppointmentClass(jsonData);
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
                'dayAndTime', 'service', 'modifiedBy', 'appointmentStatus', 'customer', 'barberShopWorker', 'id'
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
            const updateTable = 'UPDATE appointment ';
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

    async deleteAppointments(jsonData, authorizedWppId) {
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
                const appointment = new AppointmentClass(appointmentRow);
                const appointmentRecord = appointment.toDatabaseRecord();
                newAppointmentsList.push(appointmentRecord);
            }
        } else {
            console.log('newAppointment Input: ' + JSON.stringify(jsonData, null, 4));
            const appointment = new AppointmentClass(jsonData);
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
                'id'
            ]
            for (const appointment of newAppointmentsList) {
                let appointmentOrderedValues = [];
                appointmentOrderedValues.push(authorizedWppId || null);
                appointmentOrderedValues.push(authorizedWppId || null);
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
            const updateTable = 'DELETE a FROM appointment AS a LEFT JOIN barberShop AS bs ON bs.id = a.barberShop ';
            let setStatement = 'WHERE (a.customer=? OR bs.wppId=?) AND ';
            for (const key of keys) {
                if (keys.indexOf(key) == 0) {
                    setStatement += 'a.' + key + '=?';
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
                                ...nL,
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

}

module.exports.AppointmentService = new AppointmentService();