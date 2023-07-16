const axios = require('axios');
const Logger = require('../utils/logger');

class DepartmentService {
    constructor() {
        this.logger = new Logger('department-service');
    }

    async getdepartmentById(department_id) {
        try {
            this.logger.info(`Fetching department by id ${department_id}`);
            const response = await axios.get(`${process.env.URL_SERVICE_OPERATION}/departments/${department_id}`);
            return response.data.data;
        } catch (error) {
            this.logger.error(`Error fetching department by department_id: ${error.message}`);
            return false;
        }
    }

    async getAllDepartments() {
        try {
            this.logger.info(`Fetching departments`);
            const response = await axios.get(`${process.env.URL_SERVICE_OPERATION}/departments?pageSize=-1`);
            return response.data.data;
        } catch (error) {
            this.logger.error(`Error fetching departments: ${error.message}`);
            return false;
        }
    }
}

module.exports = new DepartmentService();
