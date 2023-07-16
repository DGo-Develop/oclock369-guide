const axios = require('axios');
const Logger = require('../utils/logger');

class identificationTypeService {
    constructor() {
        this.logger = new Logger('identification-type-service');
    }

    async getidentificationTypes() {
        try {
            this.logger.info(`Fetching identification type`);
            const response = await axios.get(`${process.env.URL_SERVICE_OPERATION}/identificationTypes?pageSize=-1`);
            return response.data.data;
        } catch (error) {
            this.logger.error(`Error fetching identification type: ${error.message}`);
            return false;
        }
    }
}

module.exports = new identificationTypeService();