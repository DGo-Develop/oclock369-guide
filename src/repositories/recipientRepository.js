const pool = require('../config/database');
const Recipient = require('../models/recipient');
const Logger = require('../utils/logger');

class RecipientRepository {
    constructor() {
        this.logger = new Logger('recipient-repository');
    }

    async create(recipient) {
        this.logger.info('Creating new recipient in the database');
        await pool.query('INSERT INTO guide.recipient SET ?', [recipient.toDatabaserow()]);
        return recipient;
    }

    async findById(recipient_id) {
        this.logger.info(`Querying recipient with id = ${recipient_id}`);
        const rows = await pool.query('SELECT * FROM guide.recipient WHERE recipient_id = ?', [recipient_id]);
        return rows.length > 0 ? Recipient.fromDatabaseRow(rows[0]) : null;
    }

    async findByIdentification(identification_type, identification_number) {
        this.logger.info(`Querying recipient with identification_type = ${identification_type} and identification_number = ${identification_number}`);
        const rows = await pool.query(` SELECT  recipient_id, first_name, last_name, 
                                                identification_type_id, identification, phone, 
                                                address_id ra_address_id, office_id, status 
                                        FROM guide.recipient ra 
                                        WHERE identification_type_id = ? AND identification = ?`, [identification_type, identification_number]);
        return rows.length > 0 ? Recipient.fromDatabaseRow(rows[0]) : null;
    }
}

module.exports = new RecipientRepository();
