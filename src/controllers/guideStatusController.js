const httpResponse = require('../utils/httpResponse');
const Logger = require('../utils/logger');
const guideStatusService = require('../services/guideStatusService');
const GuideStatus = require('../models/guideStatus');

this.logger = new Logger('guide-status-controller');

const getAllGuideStatuses = async (req, res) => {
    try {
        this.logger.info('Getting all guide statuses');
        const guideStatuses = await guideStatusService.getAllGuideStatuses(true);
        httpResponse.ok(res, guideStatuses.map(status => status.toSafeObject()));
    } catch (error) {
        this.logger.error(`Error getting all guide statuses: ${error.message}`);
        httpResponse.internalServerError(res, error.message);
    }
};

const getStatusByName = async (req, res) => {
    try {
        this.logger.info('Getting all guide statuses');
        const name = req.params.statusName;
        const guideStatuses = await guideStatusService.getGuideStatusByName(name);
        httpResponse.ok(res, new GuideStatus(guideStatuses).toSafeObject());
    } catch (error) {
        this.logger.error(`Error getting all guide statuses: ${error.message}`);
        httpResponse.internalServerError(res, error.message);
    }
};

const getStatusByExternalId = async (req, res) => {
    try {
        this.logger.info('Getting all guide statuses');
        const status_guide_external_id = req.params.status_guide_external_id;
        const guideStatuses = await guideStatusService.getStatusByExternalId(status_guide_external_id);
        httpResponse.ok(res, new GuideStatus(guideStatuses).toSafeObject());
    } catch (error) {
        this.logger.error(`Error getting all guide statuses: ${error.message}`);
        httpResponse.internalServerError(res, error.message);
    }
};

const getStatusById = async (req, res) => {
    try {
        this.logger.info('Getting guide status by ID');
        const status_guide_id = req.params.status_guide_id;
        const guideStatus = await guideStatusService.getGuideStatusById(status_guide_id);
        httpResponse.ok(res, new GuideStatus(guideStatus).toSafeObject());
    } catch (error) {
        this.logger.error(`Error getting guide status by ID: ${error.message}`);
        httpResponse.internalServerError(res, error.message);
    }
};

module.exports = {
    getAllGuideStatuses,
    getStatusByName,
    getStatusByExternalId,
    getStatusById
};