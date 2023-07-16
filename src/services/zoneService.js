const axios = require('axios');
const Logger = require('../utils/logger');

class ZoneService {
    constructor() {
        this.logger = new Logger('zone-service');
    }

    async getZoneById(zone_id) {
        try {
            this.logger.info(`Fetching zone by id ${zone_id}`);
            const response = await axios.get(`${process.env.URL_SERVICE_OPERATION}/zones/${zone_id}`);
            return response.data.data;
        } catch (error) {
            this.logger.error(`Error fetching zone by zone_id: ${error.message}`);
            return false;
        }
    }
}

module.exports = new ZoneService();

