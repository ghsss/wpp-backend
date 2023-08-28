// const crypto = require('crypto');

const { DatabaseService } = require("../services/DatabaseService");

class DatabaseUtil {

    database = DatabaseService;

    insert(table, fields, values) {
        // str, str, [[?]]
        const pool = this.database.getPool();
        const response = {
            success: false,
            response: []
        }
        const newList = [];
        // const newList = Array();
        return new Promise((resolve, reject) => {
            // const keys = [
            //     'barberShop', 'worker'
            // ]
            try {

                for (const BarberShopWorker of values) {
                    let BarberShopWorkerOrderedValues = [];
                    for (const key of fields) {
                        BarberShopWorkerOrderedValues.push(BarberShopWorker[key] || null);
                    }
                    newList.push(BarberShopWorkerOrderedValues);
                }
                console.log('Values >  ' + JSON.stringify(newList, null, 4));
                const insertTable = 'INSERT INTO ' + table + '(';
                let setStatement = '';
                for (const key of fields) {
                    if (fields.indexOf(key) == 0) {
                        setStatement += key;
                    } else {
                        if (fields.indexOf(key) == fields.length - 1) {
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
            } catch (error) {
                response.error = [];
                response.error.push(err);
                reject(error);
            }
        })

    }

}

module.exports.DatabaseUtil = new DatabaseUtil();