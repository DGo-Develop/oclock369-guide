const pool = require('../config/database');
const Logger = require('../utils/logger');

class EmailRepository {
    constructor() {
        this.logger = new Logger('email-repository');
    }

    async create(emailInstance) {
        this.logger.info('Creating new email in the database');
        await pool.query('INSERT INTO guide.email SET ?', [emailInstance.toDatabaseRow()]);
    }

    async findByEntityId(entityId) {
        this.logger.info(`Querying emails with entity_id = ${entityId}`);
        const rows = await pool.query('SELECT * FROM guide.email WHERE entity_id = ?', [entityId]);
        return rows;
    }
}

module.exports = new EmailRepository();
