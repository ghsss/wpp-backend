const { AppointmentClass } = require("../models/Appointment");
const { AppointmentStatusService } = require("./AppointmentStatusService");
const { DatabaseService } = require("./DatabaseService");

class AppointmentService {

    #database = DatabaseService;
    #selectedAppointment = AppointmentClass;
    #appointmentList = new Array(AppointmentClass);

    constructor(jsonData) {


        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a JSON as argument.\n' + error);
            }
        }

        // serialize();

    }

    refresh(jsonData) {

    }

    async getBarberShopAppointments(barberShopId) {

        const pool = this.#database.getPool();
        const response = {
            success: false,
            response: []
        }

        // const newList = [];
        const newList = new Array(AppointmentClass);

        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT 
                a.id, a.dayAndTime, a.createdBy, a.modifiedBy, a.createdAt, a.modifiedAt, a.appointmentStatus,
                c.id AS customerId, c.name AS customerName, c.phone as customerPhone,
                bs.id as barberShopId, bs.name as barberShopName, bs.phone as barberShopPhone, bs.city as barberShopCity, cy.name as barberShopCityName, 
                bs.neighborhood as barberShopNeighborhood, bs.street as barberShopStreet, bs.number as barberShopNumber, bs.complement barberShopComplement, 
                bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId as barberShopWppId,
                b.id AS workerId, b.name AS workerName, b.phone AS workerPhone 
                FROM appointment AS a 
                JOIN barberShop AS bs ON a.barberShop = bs.id 
                JOIN barberShopWorker AS bsw ON a.barberShopWorker = bsw.id 
                JOIN barber AS b ON b.id = bsw.worker
                JOIN customer AS c ON c.id = a.customer
                JOIN city AS cy ON cy.id = bs.city 
                WHERE a.barberShop = ? AND a.appointmentStatus = ?`,
                [barberShopId, 'Agendado'],
                function (err, rows, fields) {

                    if (err) reject(err);

                    console.log(rows);

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
                    for (const row of rows) {

                        let appointmentStatus = new AppointmentClass(row);
                        newList.push(appointmentStatus);

                    }

                    resolve(newList);

                });
        });

    }

    getCustomerAppointments(customerId) {

        const pool = this.#database.getPool();
        const response = {
            success: false,
            response: []
        }

        // const newList = [];
        const newList = new Array(AppointmentClass);

        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT 
                a.id, a.dayAndTime, a.createdBy, a.modifiedBy, a.createdAt, a.modifiedAt, a.appointmentStatus,
                c.id AS customerId, c.name AS customerName, c.phone as customerPhone,
                bs.id as barberShopId, bs.name as barberShopName, bs.phone as barberShopPhone, bs.city as barberShopCity, cy.name as barberShopCityName, 
                bs.neighborhood as barberShopNeighborhood, bs.street as barberShopStreet, bs.number as barberShopNumber, bs.complement barberShopComplement, 
                bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId as barberShopWppId,
                b.id AS workerId, b.name AS workerName, b.phone AS workerPhone 
                FROM appointment AS a 
                JOIN barberShop AS bs ON a.barberShop = bs.id 
                JOIN barberShopWorker AS bsw ON a.barberShopWorker = bsw.id 
                JOIN barber AS b ON b.id = bsw.worker
                JOIN customer AS c ON c.id = a.customer
                JOIN city AS cy ON cy.id = bs.city 
                WHERE customer = ?`,
                [customerId],
                function (err, rows, fields) {

                    if (err) reject(err);

                    console.log(rows);

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
                    for (const row of rows) {

                        let appointmentStatus = new AppointmentClass(row);
                        newList.push(appointmentStatus);

                    }

                    resolve(newList);

                });
        });

    }

    newAppointment(jsonData) {

        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a JSON as argument.\n' + error);
            }
        }

        console.log(JSON.stringify(jsonData));

        const jsonKeys = Object.keys(jsonData);

        for (const key of jsonKeys) {

            this.#selectedAppointment[key] = jsonData[key];

        }

        console.log(JSON.stringify(this.#selectedAppointment, null, 4));

    }

    cancelAppointment(jsonData) {

        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a JSON as argument.\n' + error);
            }
        }

        console.log(JSON.stringify(jsonData));

        const jsonKeys = Object.keys(jsonData);

        for (const key of jsonKeys) {

            this.#selectedAppointment[key] = jsonData[key];

        }

        const cancelledStatus = AppointmentStatusService.getCancelledStatus();

        this.#selectedAppointment['appointmentStatus'] = cancelledStatus.id;

        console.log(JSON.stringify(this.#selectedAppointment, null, 4));

    }

}

module.exports.AppointmentService = new AppointmentService();
// module.exports.CreatedByClass = CreatedBy;