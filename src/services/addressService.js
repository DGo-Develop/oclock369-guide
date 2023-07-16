const axios = require('axios');
const Logger = require('../utils/logger');
const stringUtils = require('../utils/stringUtils');
const ErrorHandler = require('../utils/errorHandler');

class AddressService {
    constructor(cities, departments) {
        this.cities = cities;
        this.departments = departments;
        this.logger = new Logger('address-service');
        this.errorHandler = new ErrorHandler(this.logger);
    }

    async addressExists(address, isloadfile) {
        let response;

        try {
            if (address.address_id) {
                response = await axios.get(`${process.env.URL_SERVICE_OPERATION}/addresses/${address.address_id}`);
            }

            if (address.street && !address.address_id) {
                const encodedStreet = decodeURIComponent(`${process.env.URL_SERVICE_OPERATION}/addresses/street/${address.street}`);
                response = await axios.get(encodedStreet);
            }

            if (response.status === 200) {
                return response.data.data;
            } else {
                return false;
            }
        } catch (error) {
            if (error.response.status === 404) {
                return this.createAddress(address, isloadfile);
            }
        }
    }

    async createAddress(address, isloadfile) {
        if (isloadfile) {
            const city = this.cities.cities.filter(x => stringUtils.compareStrings(x.name, address.city_id))[0];

            if (city) {
                address.city_id = city.city_id;
            }
            else {
                this.errorHandler(`La ciudad ${address.city_id} enviada no existe.`);
            }

            const department = this.departments.departments.filter(x => stringUtils.compareStrings(x.name, address.department_id))[0];

            if (department) {
                address.department_id = department.department_id;
            }
            else {
                this.errorHandler(`El departamento ${address.department_id} enviada no existe.`);
            }
        }

        try {
            const response = await axios.post(`${process.env.URL_SERVICE_OPERATION}/addresses`, address);
            if (response.status === 200 || response.status === 201) {
                return response.data.data.address;
            } else {
                this.errorHandler('Error creating address');
            }
        } catch (error) {
            if (error.response.status === 409) {
                return error.response.data.error.address;
            }
        }
    }
}

module.exports = AddressService;
