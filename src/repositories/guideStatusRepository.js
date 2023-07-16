const pool = require('../config/database');
const GuideStatus = require('../models/guideStatus');
const Logger = require('../utils/logger');

class GuideStatusRepository {
    constructor() {
        this.logger = new Logger('guide-status-repository');
    }

    async findAll(status) {
        this.logger.info(`Querying guide statuses with status = ${status}`);
        const rows = await pool.query('SELECT * FROM guide.status_guide WHERE status = ?', [status]);
        return rows.map(row => GuideStatus.fromDatabaseRow(row));
    }

    async findByName(status_name) {
        this.logger.info(`Querying guide statuses with status name = ${status_name}`);
        const rows = await pool.query('SELECT * FROM guide.status_guide WHERE name = ?', [status_name]);
        return rows.length > 0 ? GuideStatus.fromDatabaseRow(rows[0]) : null;
    }

    async findByExternalId(status_guide_external_id) {
        this.logger.info(`Querying guide statuses with external id = ${status_guide_external_id}`);
        const rows = await pool.query('SELECT * FROM guide.status_guide WHERE status_guide_external_id = ?', [status_guide_external_id]);
        return rows.length > 0 ? GuideStatus.fromDatabaseRow(rows[0]) : null;
    }

    async getGuideStatusById(status_guide_id) {
        this.logger.info('Getting guide status from the database');
        const rows = await pool.query('SELECT * FROM guide.status_guide WHERE status_guide_id = ?', [status_guide_id]);
        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = new GuideStatusRepository();
