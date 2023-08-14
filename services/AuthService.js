const { AppointmentClass } = require('../models/Appointment');
const { AppointmentService } = require('./AppointmentService');
const { DatabaseService } = require('./DatabaseService');

class AuthService {

    #database = DatabaseService;

    async login(wppId, option) {
        const defaultOpts = {
            'tableName': 'customer',
            'tableNameWppId': {
                'customer': 'id',
                'barber': 'id',
                'barberShop': 'wppId'
            },
            'defaultAppointments': {
                'CUSTOMER': AppointmentService.getCustomerAppointments,
                'BARBER': AppointmentService.getBarberShopAppointments,
                'BARBERSHOP': AppointmentService.getBarberShopAppointments
            }
        };
        const optsDict = {
            'CUSTOMER': 'customer',
            'BARBER': 'barber',
            'BARBERSHOP': 'barberShop'
        }
        if (typeof wppId !== 'string') {
            throw 'Expected a string as first argument.';
        }
        else if (typeof option !== 'string') {
            throw 'Expected a string as second argument.';
        } else {
            const upperCaseOption = option.toLocaleUpperCase();
            if (Object.keys(optsDict).includes(upperCaseOption)) {
                option = optsDict[upperCaseOption];
            } else {
                option = defaultOpts['tableName'];
            }
            const response = {
                success: false,
                response: [
                    {
                        user: {
                            id: new String(),
                            name: new String(),
                            phone: new String(),
                            userType: upperCaseOption,
                            appointments: Array(AppointmentClass),
                        }
                    }
                ]
            }
            const tableName = option;
            const tableAuthIdentifier = defaultOpts['tableNameWppId'][tableName];
            const newList = [];
            const thiInstance = this;
            return new Promise( async (resolve, reject) => {
                const pool = thiInstance.#database.getPool();
                pool.query(`SELECT * FROM ${tableName} WHERE ${tableAuthIdentifier}=?`, [wppId], async function (err, rows, fields) {
                    if (err) {
                        response.error = err;
                        reject (response);
                    }
                    // Connection is automatically released when query resolves
                    if (Array.isArray(rows)) {
                        console.log('Auth first row: '+JSON.stringify(rows[0], null, 4));
                        for await (const row of rows) {
                            response.success = true;
                            response.response[0].user.id = row[tableAuthIdentifier];
                            response.response[0].user.name = row['name'];
                            response.response[0].user.phone = row['phone'];
                            if ( upperCaseOption == 'BARBER' ) {
                                response.response[0].user.appointments = [];
                            } else {
                                // response.response[0].appointments = await defaultOpts['defaultAppointments'][upperCaseOption](wppId)
                                // .catch( err2 => {
                                //     reject(err2);
                                //     response.error = err2;
                                // } );
                                if ( upperCaseOption == 'CUSTOMER' ) {
                                    console.log(response.response[0].user.appointments);
                                    response.response[0].user.appointments = await AppointmentService.getCustomerAppointments(wppId)//await defaultOpts['defaultAppointments'][upperCaseOption](wppId)
                                    .catch( err2 => {
                                        reject(err2);
                                        response.error = err2;
                                    } );
                                } else {
                                    console.log(JSON.stringify(response.response[0].user.appointments, null, 4));
                                    response.response[0].user.appointments = await AppointmentService.getBarberShopAppointments(wppId)//await defaultOpts['defaultAppointments'][upperCaseOption](wppId)
                                    .catch( err2 => {
                                        reject(err2);
                                        response.error = err2;
                                    } );
                                }
                            }
                            resolve(response);
                        }
                    } else {
                        throw err;
                    }
                });
            });
        }
    }

    getAll() {
        return this.AuthList;
    }

    getCancelledStatus() {
        let AuthR = new AuthClass({});
        for (const Auth of this.AuthList) {
            if (Auth.id == 'Cancelado') {
                AuthR = Auth;
            }
        }
        return AuthR;
    }

}

module.exports.AuthService = new AuthService();