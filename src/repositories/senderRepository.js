const pool = require('../config/database');
const Sender = require('../models/sender');
const Logger = require('../utils/logger');

class SenderRepository {
    constructor() {
        this.logger = new Logger('sender-repository');
    }

    async create(sender) {
        this.logger.info('Creating new sender in the database');
        await pool.query('INSERT INTO guide.sender SET ?', [sender.toDatabaserow()]);
        return sender;
    }

    async findById(sender_id) {
        this.logger.info(`Querying sender with id = ${sender_id}`);
        const rows = await pool.query('SELECT * FROM guide.sender WHERE sender_id = ?', [sender_id]);
        return rows.length > 0 ? Sender.fromDatabaseRow(rows[0]) : null;
    }

    async findByOfficeId(office_id) {
        this.logger.info(`Querying sender with id = ${office_id}`);
        const rows = await pool.query(`SELECT sender_id, first_name, last_name, identification_type_id, identification, 
                                        phone, address_id sa_address_id, office_id, status 
                                        FROM guide.sender WHERE office_id = ?`, [office_id]);
        return rows.length > 0 ? Sender.fromDatabaseRow(rows[0]) : null;
    }

    async findByIdentification(identification_type, identification_number) {
        this.logger.info(`Querying sender with identification_type = ${identification_type} and identification_number = ${identification_number}`);
        const rows = await pool.query(` SELECT  sender_id, first_name, last_name, 
                                                identification_type_id, identification, phone, address_id sa_address_id, 
                                                office_id, status FROM guide.sender sa 
                                        WHERE identification_type_id = ? AND identification = ?`, [identification_type, identification_number]);
        return rows.length > 0 ? Sender.fromDatabaseRow(rows[0], null) : null;
    }
}

module.exports = new SenderRepository();
