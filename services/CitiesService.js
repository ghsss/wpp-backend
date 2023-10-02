const { DatabaseService } = require("./DatabaseService");

class CitiesService {

    database = DatabaseService;
    
    async getCities() {
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
                c.id,
                c.name,
                c.phoneCode,
                c.state,
                s.name AS stateName
                FROM city AS c
                JOIN state AS s ON c.state = s.id
                GROUP BY s.name`,
                // [customerWppId, 'Agendado'],
                function (err, rows, fields) {
                    if (err) reject(err);
                    if (Array.isArray(rows)) {
                        console.log('Fist row ' + JSON.stringify(rows[0], null, 4));
                        for (const row of rows) {
                            newList.push(row);
                        }
                    }
                    console.log('List: ' + JSON.stringify(newList));
                    resolve(newList);
                });
        });
    
    }

}

module.exports.CitiesService = new CitiesService();