const httpResponse = require('../utils/httpResponse');
const Logger = require('../utils/logger');
const subStatusGuideService = require('../services/subStatusGuideService');
const SubStatusGuide = require('../models/subStatusGuide');

this.logger = new Logger('sub-status-guide-controller');

const getStatusByExternalId = async (req, res) => {
    try {
        this.logger.info('Getting all guide statuses');
        const sub_status_guide_external_id = req.params.sub_status_guide_external_id;
        const subStatuses = await subStatusGuideService.getSubStatusByExternalId(sub_status_guide_external_id);
        httpResponse.ok(res, new SubStatusGuide(subStatuses).toSafeObject());
    } catch (error) {
        this.logger.error(`Error getting all guide statuses: ${error.message}`);
        httpResponse.internalServerError(res, error.message);
    }
};

const getStatusById = async (req, res) => {
    try {
        this.logger.info('Getting sub status by id');
        const sub_status_guide_id = req.params.sub_status_guide_id;
        const subStatus = await subStatusGuideService.getSubStatusById(sub_status_guide_id);
        httpResponse.ok(res, new SubStatusGuide(subStatus).toSafeObject());
    } catch (error) {
        this.logger.error(`Error getting sub status by id: ${error.message}`);
        httpResponse.internalServerError(res, error.message);
    }
};

module.exports = {
    getStatusByExternalId,
    getStatusById
};