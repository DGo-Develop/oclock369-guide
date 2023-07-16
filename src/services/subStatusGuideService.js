const beetrackService = require('./beetrackService');
const guideStatusService = require('./guideStatusService');
const subStatusGuideRepository = require('../repositories/subStatusGuideRepository');
const Logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class SubStatusGuideService {
    constructor() {
        this.logger = new Logger('sub-status-guide-service');
    }

    async fetchAndStoreSubStatuses() {
        const data = await beetrackService.fetchSubStatuses();

        if (data) {
            this.logger.info('Transforming and storing sub statuses');
            for (const item of data) {
                const status = await guideStatusService.getStatusByExternalId(item.status_id);
                if (status && item.code) {
                    const transformedData = {
                        sub_status_guide_id: uuidv4(),
                        sub_status_guide_external_id: item.code,
                        name: item.name,
                        status: true,
                        status_guide_id: status.status_guide_id
                    };

                    const existingSubStatus = await subStatusGuideRepository.getSubStatusByExternalId(item.code);
                    if (existingSubStatus) {
                        transformedData.sub_status_guide_id = existingSubStatus.sub_status_guide_id;
                        await subStatusGuideRepository.update(item.code, transformedData);
                    } else {
                        await subStatusGuideRepository.insert(transformedData);
                    }
                }
            }
        }
    }

    async getSubStatusByExternalId(sub_status_guide_external_id) {
        this.logger.info('Retrieving guide statuses from repository');
        return await subStatusGuideRepository.getSubStatusByExternalId(sub_status_guide_external_id);
    }

    async getSubStatusById(sub_status_guide_id) {
        this.logger.info('Retrieving sub status by id from repository');
        return await subStatusGuideRepository.getSubStatusById(sub_status_guide_id);
    }
}

module.exports = new SubStatusGuideService();
