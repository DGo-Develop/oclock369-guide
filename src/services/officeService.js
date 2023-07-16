const axios = require('axios');
const Logger = require('../utils/logger');

class OfficeService {
    constructor() {
        this.logger = new Logger('office-service');
    }

    async officeExists(office_id) {
        try {
            this.logger.info(`Checking if office with ID ${office_id} exists`);
            const response = await axios.get(`${process.env.URL_SERVICE_CLIENT}/offices/${office_id}`);
            return response.data.data;
        } catch (error) {
            this.logger.error(`Error checking if office exists: ${error.message}`);
            return false;
        }
    }

    async getClientByOfficeId(client_id) {
        try {
            this.logger.info(`Fetching client by client_id ${client_id}`);
            const response = await axios.get(`${process.env.URL_SERVICE_CLIENT}/clients/${client_id}`);
            return response.data.data;
        } catch (error) {
            this.logger.error(`Error fetching client by client_id: ${error.message}`);
            return false;
        }
    }
}

module.exports = new OfficeService();

