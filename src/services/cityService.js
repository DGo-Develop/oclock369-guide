const axios = require('axios');
const Logger = require('../utils/logger');

class CityService {
    constructor() {
        this.logger = new Logger('city-service');
    }
    async getCityById(city_id) {
        try {
            this.logger.info(`Fetching city by id ${city_id}`);
            const response = await axios.get(`${process.env.URL_SERVICE_OPERATION}/cities/${city_id}`);
            return response.data.data;
        } catch (error) {
            this.logger.error(`Error fetching client by client_id: ${error.message}`);
            return false;
        }
    }

    async getAllCities() {
        try {
            this.logger.info(`Fetching cities`);
            const response = await axios.get(`${process.env.URL_SERVICE_OPERATION}/cities?pageSize=-1`);
            return response.data.data;
        } catch (error) {
            this.logger.error(`Error fetching cities: ${error.message}`);
            return false;
        }
    }
}

module.exports = new CityService();

