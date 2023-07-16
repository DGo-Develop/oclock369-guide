const pool = require('../config/database');
const Logger = require('../utils/logger');

class SubStatusGuideRepository {
    constructor() {
        this.logger = new Logger('sub-status-guide-repository');
    }

    async getSubStatusById(sub_status_guide_id) {
        this.logger.info('Getting sub status from the database by id');
        const rows = await pool.query('SELECT * FROM sub_status_guide WHERE sub_status_guide_id = ?', [sub_status_guide_id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async getSubStatusByExternalId(sub_status_guide_external_id) {
        this.logger.info('Getting sub status from the database');
        const rows = await pool.query('SELECT * FROM sub_status_guide WHERE sub_status_guide_external_id = ?', [sub_status_guide_external_id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async insert(data) {
        this.logger.info('Inserting sub status into the database');
        await pool.query('INSERT INTO sub_status_guide SET ?', [data]);
    }

    async update(sub_status_guide_external_id, data) {
        this.logger.info('Updating sub status in the database');
        await pool.query('UPDATE sub_status_guide SET ? WHERE sub_status_guide_external_id = ?', [data, sub_status_guide_external_id]);
    }
}

module.exports = new SubStatusGuideRepository();
