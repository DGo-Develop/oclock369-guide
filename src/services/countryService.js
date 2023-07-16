const axios = require('axios');
const Logger = require('../utils/logger');

class CountryService {
    constructor() {
        this.logger = new Logger('country-service');
    }
    
    async getcountryById(country_id) {
        try {
            this.logger.info(`Fetching country by id ${country_id}`);
            const response = await axios.get(`${process.env.URL_SERVICE_OPERATION}/countries/${country_id}`);
            return response.data.data;
        } catch (error) {
            this.logger.error(`Error fetching country by country_id: ${error.message}`);
            return false;
        }
    }
}

module.exports = new CountryService();
