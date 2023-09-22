const { AppointmentClass } = require('../models/Appointment');
const { CryptoUtil } = require('../util/CryptoClass');
const { AppointmentService } = require('./AppointmentService');
const { DatabaseService } = require('./DatabaseService');
const crypto = require('crypto');

class AuthService {

    #database = DatabaseService;
    #tokens = {

    }

    constructor() {
        this.clearInvalidTokens();
    }

    async verifyStoredToken(token) {
        console.log('Verifying stored token...');
        const pool = this.#database.getPool();
        const encryptedToken = CryptoUtil.hash(token);
        return new Promise( (resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            pool.query(`SELECT wppId FROM wppAllowedDevice WHERE hash=?`, [encryptedToken], async function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    response.error = err;
                    reject(response);
                }
                if ( Array.isArray(rows) && rows.length > 0 ) {
                    response.response = rows;
                    response.success = true;
                }
                console.log(JSON.stringify(response));
                response.success = true;
                resolve(response);
            });

        });
    }

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
            return new Promise(async (resolve, reject) => {
                const pool = thiInstance.#database.getPool();
                pool.query(`SELECT * FROM ${tableName} WHERE ${tableAuthIdentifier}=?`, [wppId], async function (err, rows, fields) {
                    if (err) {
                        response.error = err;
                        reject(response);
                    }
                    // Connection is automatically released when query resolves
                    if (Array.isArray(rows)) {
                        console.log('Auth first row: ' + JSON.stringify(rows[0], null, 4));
                        for await (const row of rows) {
                            response.success = true;
                            response.response[0].user.id = row[tableAuthIdentifier];
                            response.response[0].user.name = row['name'];
                            response.response[0].user.phone = row['phone'];
                            if (upperCaseOption == 'BARBER') {
                                response.response[0].user.appointments = [];
                            } else {
                                // response.response[0].appointments = await defaultOpts['defaultAppointments'][upperCaseOption](wppId)
                                // .catch( err2 => {
                                //     reject(err2);
                                //     response.error = err2;
                                // } );
                                if (upperCaseOption == 'CUSTOMER') {
                                    console.log(response.response[0].user.appointments);
                                    response.response[0].user.appointments = await AppointmentService.getCustomerAppointments(wppId)//await defaultOpts['defaultAppointments'][upperCaseOption](wppId)
                                        .catch(err2 => {
                                            reject(err2);
                                            response.error = err2;
                                        });
                                } else {
                                    console.log(JSON.stringify(response.response[0].user.appointments, null, 4));
                                    response.response[0].user.appointments = await AppointmentService.getBarberShopAppointments(wppId)//await defaultOpts['defaultAppointments'][upperCaseOption](wppId)
                                        .catch(err2 => {
                                            reject(err2);
                                            response.error = err2;
                                        });
                                }
                            }
                            response.success = true;
                            resolve(response);
                        }
                    } else {
                        throw err;
                    }
                });
            });
        }
    }

    clearInvalidTokens() {
        setInterval(() => {
            // console.log('Cleaning... ');
            // console.log('A: '+JSON.stringify(this.#tokens));
            // 5 Minutes limit to Wpp code verification
            const timeout = 300000;
            for (const wppId of Object.keys(this.#tokens)) {
                if (new Date().getTime() > this.#tokens[wppId]['timestamp'] + timeout) {
                    delete this.#tokens[wppId];
                    console.log('Deleted token for wppId: ' + wppId);
                }
            }
        }, 1500);
    }

    verifyToken(wppId, token, callback) {
        // 5 Minutes limit to Wpp code verification
        const timeout = 300000;
        if (Object.keys(this.#tokens).includes(wppId)
            && new Date().getTime() <= this.#tokens[wppId]['timestamp'] + timeout
            && Number(this.#tokens[wppId]['token']) == Number(token)) {
            crypto.
                generateKey('hmac', { length: 256 }, (err, key) => {
                    if (err) throw err;
                    const hexKey = key.export().toString('hex');  // 46e..........620
                    const hash = CryptoUtil.hash(hexKey);//crypto.createHash('sha512').update(hexKey).digest('hex');
                    callback(hexKey, hash);
                });
            // ENCRYPT AND STORE THE ENCRYPTED HEX KEY OF THE VERIFIED USER IN THE DATABASE
            // SEND THE HEX KEY TO THE VERIFIED USER APP STORE IT IN THE LOCAL STORAGE
            return true;
        } else {
            console.log(JSON.stringify(this.#tokens));
            callback('Invalid token');
            return false;
        }
    }

    generateToken(wppId) {
        if (typeof wppId !== 'string') throw 'Expected a string as argument';
        const array = new Uint32Array(3);
        crypto.getRandomValues(array);
        let n = '';
        for (const num of array) {
            n += String(num).substring(0, 2);
        }
        n = Number(n);
        this.#tokens[wppId] = {};
        this.#tokens[wppId]['token'] = n;
        this.#tokens[wppId]['timestamp'] = new Date().getTime();
        return n;
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