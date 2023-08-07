// get the client
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbName = process.env.DB_NAME || 'testdb';
const dbUser = process.env.DB_USER || 'convidado';
const dbPWD = process.env.DB_PWD || '12345';

class Database {

    // Create the connection pool. The pool-specific settings are the defaults
    #client = mysql.createPool({
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPWD,
        database: dbName,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    });

    getPool() {

        return this.#client;

    }

}

module.exports.DatabaseService = new Database();