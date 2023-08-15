const { CustomerClass } = require("../models/Customer");
const { DatabaseService } = require("./DatabaseService");

class CustomerService {

    database = DatabaseService;
    #selectedcustomer = CustomerClass;
    #customerList = new Array(CustomerClass);

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

    async getCustomers(customerWppId) {
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
                c.id AS customerId, c.name AS customerName, c.phone as customerPhone
                FROM customer AS c`,
                // [customerWppId, 'Agendado'],
                function (err, rows, fields) {
                    if (err) reject(err);
                    // {
                    //     "id": 3,
                    //     "dayAndTime": "2023-08-08T04:46:46.000Z",
                    //     "createdBy": null,
                    //     "customerStatus": "Agendado",
                    //     "modifiedBy": null,
                    //     "createdAt": "2023-08-08T04:46:46.000Z",
                    //     "modifiedAt": "2023-08-08T04:46:46.000Z",
                    //     "customerId": "555499026453@c.us",
                    //     "customerName": "Gabriel",
                    //     "customerPhone": "555499026453",
                    //     "customerId": 1,
                    //     "customerName": "Barbearia do Gabriel",
                    //     "customerPhone": "",
                    //     "customerCity": "CZO",
                    //     "customerCityName": "Carazinho",
                    //     "customerNeighborhood": "Centro",
                    //     "customerStreet": "Alexandre da Motta",
                    //     "customerNumber": "1264",
                    //     "customerComplement": null,
                    //     "geolocationLatitude": "-28",
                    //     "geolocationLongitude": "-53",
                    //     "customerWppId": "",
                    //     "workerId": "555499026453@c.us",
                    //     "workerName": "Gabriel",
                    //     "workerPhone": "555499026453"
                    // }
                    // Connection is automatically released when query resolves
                    if (Array.isArray(rows)) {
                        console.log('Fist row ' + JSON.stringify(rows[0], null, 4));
                        for (const row of rows) {
                            let customerStatus = new CustomerClass(row);
                            newList.push(customerStatus);
                        }
                    }
                    console.log('List: ' + JSON.stringify(newList));
                    resolve(newList);
                });
        });

    }

    getCustomers() {
        const pool = this.database.getPool();
        const response = {
            success: false,
            response: []
        }
        const newList = [];
        // const newList = new Array(CustomerClass);
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT 
                c.id AS customerId, c.name AS customerName, c.phone as customerPhone
                FROM customer AS c`,
                // [customerId],
                function (err, rows, fields) {
                    if (err) reject(err);
                    // {
                    //     "id": 3,
                    //     "customerId": 1,
                    //     "customerName": "Barbearia do Gabriel",
                    //     "customerPhone": "",
                    //     "customerCity": "CZO",
                    //     "customerCityName": "Carazinho",
                    //     "customerNeighborhood": "Centro",
                    //     "customerStreet": "Alexandre da Motta",
                    //     "customerNumber": "1264",
                    //     "customerComplement": null,
                    //     "geolocationLatitude": "-28",
                    //     "geolocationLongitude": "-53",
                    //     "customerWppId": "",
                    // }
                    // Connection is automatically released when query resolves
                    if (Array.isArray(rows)) {
                        console.log('Fist row ' + JSON.stringify(rows[0], null, 4));
                        for (const row of rows) {
                            let customerStatus = new CustomerClass(row);
                            newList.push(customerStatus);
                        }
                    }
                    resolve(newList);
                });
        });

    }

    newCustomers(jsonData) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                throw 'Error: expected a valid JSON as argument.\n' + error;
            }
        }
        const newcustomersList = [];
        // const newcustomersList = new Array(CustomerClass);
        if (Array.isArray(jsonData)) {
            console.log('newcustomer Batch Input rows: ' + jsonData.length);
            console.log('newcustomer Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const customerRow of jsonData) {
                const customer = new CustomerClass(customerRow);
                const customerRecord = customer.toDatabaseRecord();
                newcustomersList.push(customerRecord);
            }
        } else {
            console.log('newcustomer Input: ' + JSON.stringify(jsonData, null, 4));
            const customer = new CustomerClass(jsonData);
            const customerRecord = customer.toDatabaseRecord();
            newcustomersList.push(customerRecord);
        }
        console.log('New customers: ' + JSON.stringify(newcustomersList, null, 4));
        return new Promise((resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newcustomersList.length == 0) { response.error = ['Error: empty list. Nothing to insert']; reject(response) };
            const pool = this.database.getPool();
            const newList = [];
            // const newList = new Array(CustomerClass);
            const keys = [
                'id', 'name', 'phone'
            ]
            for (const customer of newcustomersList) {
                let customerOrderedValues = [];
                for (const key of keys) {
                    customerOrderedValues.push(customer[key] || null);
                }
                newList.push(customerOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            const insertTable = 'INSERT INTO customer(';
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

    async updateCustomers(jsonData) {
        if (typeof jsonData == 'string') {
            try {
                jsonData = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error: expected a valid JSON as argument.\n' + error);
            }
        }
        const newcustomersList = [];
        if (Array.isArray(jsonData)) {
            console.log('newcustomer Batch Input rows: ' + jsonData.length);
            console.log('newcustomer Batch first input: ' + JSON.stringify(jsonData[0], null, 4));
            for (const customerRow of jsonData) {
                const customer = new CustomerClass(customerRow);
                const customerRecord = customer.toDatabaseRecord();
                newcustomersList.push(customerRecord);
            }
        } else {
            console.log('newcustomer Input: ' + JSON.stringify(jsonData, null, 4));
            const customer = new CustomerClass(jsonData);
            const customerRecord = customer.toDatabaseRecord();
            newcustomersList.push(customerRecord);
        }
        console.log('New customers: ' + JSON.stringify(newcustomersList, null, 4));

        return new Promise(async (resolve, reject) => {
            const response = {
                success: false,
                response: []
            }
            if (newcustomersList.length == 0) { response.error = ['Error: empty list. Nothing to update']; reject(response) };
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
            for (const customer of newcustomersList) {
                let customerOrderedValues = [];
                for (const key of keys) {
                    customerOrderedValues.push(customer[key] || null);
                }
                if (customerOrderedValues[customerOrderedValues.length - 1] == null) {
                    response.error = ['Error to update customer. wppId cannot be null. Record index: ' + newList.length - 1];
                    reject(response);
                }
                newList.push(customerOrderedValues);
            }
            console.log('Values >  ' + JSON.stringify(newList, null, 4));
            const updateTable = 'UPDATE customer ';
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
                    ...[newList],
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

module.exports.CustomerService = new CustomerService();