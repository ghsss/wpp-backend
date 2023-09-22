const { WppAllowedDeviceClass } = require("../models/WppAllowedDevice");
const { DatabaseService } = require("./DatabaseService");

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
                    response.success = true;
                    resolve(response);

                })
        });
    }
}

module.exports.AllowDevice = new AllowDevice();