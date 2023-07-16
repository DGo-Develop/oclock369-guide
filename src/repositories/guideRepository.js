const pool = require('../config/database');
const Guide = require('../models/guide');
const Logger = require('../utils/logger');

class GuideRepository {
    constructor() {
        this.logger = new Logger('guide-repository');
    }

    async create(guide) {
        this.logger.info('Creating new guide in the database');
        const result = await pool.query('INSERT INTO guide.guide SET ?', [guide.toDatabaseRow()]);
        return result.insertId;
    }

    async guideById(guideId) {
        this.logger.info('Querying guide with relations by Id');
        const guideQuery = `
                SELECT g.*, 
                    r.*, 
                    s.*, 
                    sg.status_guide_external_id,
                    sg.name status_guide_name,
                    ra.address_id as ra_address_id, 
                    ra.localized_street as ra_localized_street, 
                    ra.city_id as ra_city_id, 
                    ra.country_id as ra_country_id, 
                    ra.department_id as ra_department_id,
                    ra.zone_id as ra_zone_id,
                    ra.latitude as ra_latitude,
                    ra.longitude as ra_longitude,
                    sa.address_id as sa_address_id, 
                    sa.localized_street as sa_localized_street, 
                    sa.city_id as sa_city_id, 
                    sa.country_id as sa_country_id, 
                    sa.department_id as sa_department_id,
                    sa.zone_id as sa_zone_id,
                    sa.latitude as sa_latitude,
                    sa.longitude as sa_longitude
                FROM guide.guide g
                INNER JOIN guide.recipient r ON g.recipient_id = r.recipient_id
                INNER JOIN guide.sender s ON g.sender_id = s.sender_id
                INNER JOIN guide.status_guide sg ON g.status_guide_id = sg.status_guide_id
                LEFT JOIN operation.address ra ON r.address_id = ra.address_id
                LEFT JOIN operation.address sa ON s.address_id = sa.address_id
                WHERE g.guide_id = ?
            `;

        const emailQuery = `
            SELECT * FROM guide.email WHERE owner_id IN (?, ?)
        `;

        const guideRows = await pool.query(guideQuery, [guideId]);
        if (!guideRows.length) return { guideRows: null, emailRows: null };

        const senderId = guideRows[0].sender_id;
        const recipientId = guideRows[0].recipient_id;
        const emailRows = await pool.query(emailQuery, [senderId, recipientId]);

        return { guideRows, emailRows };
    }

    async guideByNumber(guideNumber) {
        this.logger.info('Querying guide with relations by number');
        const guideQuery = `
                SELECT g.*, 
                    r.*, 
                    s.*, 
                    sg.status_guide_external_id,
                    sg.name status_guide_name,
                    ra.address_id as ra_address_id, 
                    ra.localized_street as ra_localized_street, 
                    ra.city_id as ra_city_id, 
                    ra.country_id as ra_country_id, 
                    ra.department_id as ra_department_id,
                    ra.zone_id as ra_zone_id,
                    ra.latitude as ra_latitude,
                    ra.longitude as ra_longitude,
                    sa.address_id as sa_address_id, 
                    sa.localized_street as sa_localized_street, 
                    sa.city_id as sa_city_id, 
                    sa.country_id as sa_country_id, 
                    sa.department_id as sa_department_id,
                    sa.zone_id as sa_zone_id,
                    sa.latitude as sa_latitude,
                    sa.longitude as sa_longitude
                FROM guide.guide g
                INNER JOIN guide.recipient r ON g.recipient_id = r.recipient_id
                INNER JOIN guide.sender s ON g.sender_id = s.sender_id
                INNER JOIN guide.status_guide sg ON g.status_guide_id = sg.status_guide_id
                LEFT JOIN operation.address ra ON r.address_id = ra.address_id
                LEFT JOIN operation.address sa ON s.address_id = sa.address_id
                WHERE g.guide_number = ?
            `;

        const emailQuery = `
            SELECT * FROM guide.email WHERE owner_id IN (?, ?)
        `;

        const guideRows = await pool.query(guideQuery, [guideNumber]);
        if (!guideRows.length) return { guideRows: null, emailRows: null };

        const senderId = guideRows[0].sender_id;
        const recipientId = guideRows[0].recipient_id;
        const emailRows = await pool.query(emailQuery, [senderId, recipientId]);

        return { guideRows, emailRows };
    }

    async getUnassignedGuides(page = 1, pageSize = 10) {
        const offset = (page - 1) * pageSize;
        const query = `
            SELECT g.guide_number 
            FROM guide.guide g
            WHERE NOT EXISTS (
                SELECT 1 FROM route.route_guide rg
                WHERE rg.guide_id = g.guide_id AND rg.status = 1
            )
            LIMIT ?, ?
        `;

        const countQuery = `SELECT count(1) as totalCount
                            FROM guide.guide g
                            WHERE NOT EXISTS (
                                SELECT 1 FROM route.route_guide rg
                                WHERE rg.guide_id = g.guide_id AND rg.status = 1
                            )`;

        const results = await pool.query(query, [offset, pageSize]);
        const [countResults] = await pool.query(countQuery);
        const totalCount = countResults.totalCount;

        return {
            data: results.map(row => row.guide_number),
            totalCount,
        };
    }
}

module.exports = new GuideRepository();
