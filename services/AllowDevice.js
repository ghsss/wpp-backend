const { CustomerClass } = require("../models/Customer");
const { WppAllowedDeviceClass } = require("../models/WppAllowedDevice");
const { DatabaseService } = require("./DatabaseService");
const { WhatsappService } = require("./WhatsappService");
const { CustomerService } = require("./CustomerService");

class AllowDevice {

    database = DatabaseService;

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

    async allowDevice(jsonData) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                throw 'Error: expected a valid JSON as argument.\n' + error;
            }
        }
        const wewWppAllowedDevicesList = [];
        // const wewWppAllowedDevicesList = new Array(WppAllowedDeviceClass);
        if (Array.isArray(jsonData)) {
            console.log('wewWppAllowedDevice Batch Input rows: ' + jsonData.length);
            console.log('wewWppAllowedDevice Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const wppAllowedDeviceRow of jsonData) {
                const wppAllowedDevice = new WppAllowedDeviceClass(wppAllowedDeviceRow);
                const wppAllowedDeviceRecord = wppAllowedDevice.toDatabaseRecord();
                wewWppAllowedDevicesList.push(wppAllowedDeviceRecord);
            }
        } else {
            console.log('wewWppAllowedDevice Input: ' + JSON.stringify(jsonData, null, 4));
            const wppAllowedDevice = new WppAllowedDeviceClass(jsonData);
            const wppAllowedDeviceRecord = wppAllowedDevice.toDatabaseRecord();
            wewWppAllowedDevicesList.push(wppAllowedDeviceRecord);
        }
        console.log('New wppAllowedDevices: ' + JSON.stringify(wewWppAllowedDevicesList, null, 4));
        return new Promise((resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (wewWppAllowedDevicesList.length == 0) { response.error = ['Error: empty list. Nothing to insert']; reject(response) };
            const pool = this.database.getPool();
            const newList = [];
            // const newList = new Array(WppAllowedDeviceClass);
            const keys = [
                'wppId', 'hash'
            ]
            for (const wppAllowedDevice of wewWppAllowedDevicesList) {
                let wppAllowedDeviceOrderedValues = [];
                for (const key of keys) {
                    wppAllowedDeviceOrderedValues.push(wppAllowedDevice[key] || null);
                }
                newList.push(wppAllowedDeviceOrderedValues);
            }

            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            pool.query(
                `INSERT INTO wppAllowedDevice(wppId, hash) 
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
                    // response.success = true;

                    const wppId = newList[0][0];

                    pool.query(
                        `SELECT id FROM customer WHERE id=?`,
                        [wppId],
                        async function (err, rows, fields) {
                            if (err) {
                                if (!Object.keys(response).includes('error')) {
                                    response.error = [];
                                }
                                response.error.push(err);
                                reject(response);
                            }

                            let customerExists = false;

                            if (Array.isArray(rows)) {
                                for (const row of rows) {
                                    console.log('Customer already exists: ' + JSON.stringify(row));
                                    customerExists = true;
                                }
                            }

                            if (!customerExists) {

                                console.log('Customer doesnt exist, creating...');
                                // const wppId = newList[0];
                                const wppContact = await WhatsappService.getChatById(wppId);
                                if (wppContact) {
                                    console.log('wppContact: ' + JSON.stringify(wppContact, null, 4));
                                    console.log('wppId: ' + wppId);
                                    const contactJSON = { id: wppId, name: wppContact.name || "Digite seu nome", phone: wppId.toString().replace('@c.us', '') };
                                    const newCustomer = new CustomerClass(contactJSON);
                                    const newCustomerResponse = await CustomerService.newCustomers(newCustomer).catch(err => {
                                        if (!Object.keys(response).includes('error')) {
                                            response.error = [];
                                        }
                                        response.error.push(err);
                                        reject(response);
                                    });
                                    if (newCustomerResponse.success) {
                                        response.success = true;
                                        resolve(response);
                                    } else {
                                        reject(response);
                                    }
                                }

                            }

                            response.success = true;
                            resolve(response);

                        });

                })
        });
    }
}

module.exports.AllowDevice = new AllowDevice();