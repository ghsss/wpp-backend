const { AppointmentStatusClass } = require("../models/Appointment");
const { DatabaseService } = require('./DatabaseService');

class AppointmentStatusService {

    #database = DatabaseService;
    #appointmentStatusList = new Array(AppointmentStatusClass);
    #lastRefresh = new Date();

    constructor() {
        this.refresh();    
    }

    refresh() {

        const pool = this.#database.getPool();
        const response = {
            success: false,
            response: [] 
        }

        const newList = [];

        const thiInstance = this;

        pool.query('SELECT * FROM appointmentStatus', function (err, rows, fields) {
            
            if (err) throw err;
            // Connection is automatically released when query resolves
            for ( const row of rows ) {

                let appointmentStatus = new AppointmentStatusClass(row);
                newList.push(appointmentStatus);

            }

            thiInstance.appointmentStatusList = newList;

            thiInstance.lastRefresh = new Date();

        });


    }

    verifyLastRefresh() {

        const now  = new Date();

        const intervalInMs = 60000; 

        // GUARDA STATUS DISPONIVEIS EM CACHE POR 1 MIN, 
        // A PRÓXIMA REQUISIÇÃO APÓS 1 MIN ATUALIZA NOVAMENTE O CACHE

        if ( this.#lastRefresh.getTime() < now.getTime() - intervalInMs ) {
            this.refresh();
        }

    }

    getAll() {
        return this.appointmentStatusList;
    }

    getCancelledStatus() {
        let appointmentStatusR = new AppointmentStatusClass({});
        for ( const appointmentStatus of this.appointmentStatusList ) {
            if ( appointmentStatus.id == 'Cancelado' ) {
                appointmentStatusR = appointmentStatus;
            }
        }
        return appointmentStatusR;
    }

}

module.exports.AppointmentStatusService = new AppointmentStatusService();