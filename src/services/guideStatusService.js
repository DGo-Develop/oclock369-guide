const guideStatusRepository = require('../repositories/guideStatusRepository');
const Logger = require('../utils/logger');

class GuideStatusService {
    constructor() {
        this.logger = new Logger('address-service');
    }

    async getAllGuideStatuses(status = true) {
        this.logger.info('Retrieving guide statuses from repository');
        return await guideStatusRepository.findAll(status);
    }

    async getGuideStatusByName(status_name) {
        this.logger.info('Retrieving guide statuses from repository');
        return await guideStatusRepository.findByName(status_name);
    }

    async getStatusByExternalId(status_guide_external_id) {
        this.logger.info('Retrieving guide statuses from repository');
        return await guideStatusRepository.findByExternalId(status_guide_external_id);
    }

    async getGuideStatusById(status_guide_id) {
        this.logger.info('Retrieving guide status from repository');
        return await guideStatusRepository.getGuideStatusById(status_guide_id);
    }
}

module.exports = new GuideStatusService();