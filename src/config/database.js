const mysql = require('mysql');
const fs = require('fs');
const util = require('util');
const Logger = require('../utils/logger');
const path = require("path");
this.logger = new Logger('database-initializate');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: fs.readFileSync(path.resolve(__dirname, '../infraestructure/resources/systemfiles/BaltimoreCyberTrustRoot.crt.pem'))
});

pool.getConnection((err, connection) => {
    if (err) {
        this.logger.error(`Error connecting to the database: ${err}`);
    } else {
        connection.release();
        this.logger.info('Successful database connection');
    }
});

pool.query = util.promisify(pool.query);

module.exports = pool;
