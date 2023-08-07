const { AppointmentClass } = require("../models/Appointment");
const { AppointmentStatusService } = require("./AppointmentStatusService");

class AppointmentService {

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

        serialize();

    }

    refresh(jsonData) {

    }

    getAll(barberShopId) {
        
        return this.#appointmentList;
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

module.exports.AppointmentClass = Appointment;
module.exports.CreatedByClass = CreatedBy;