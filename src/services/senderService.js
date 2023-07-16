const BaseEntityService = require('./baseEntityService');
const senderRepository = require('../repositories/senderRepository');

class SenderService extends BaseEntityService {
    constructor(identificationTypes, cities, departments){
        super(identificationTypes, cities, departments)
    }

    async createOrValidateSender(senderData, office, isloadfile) {
        return await this.createOrValidateEntity(senderData, senderRepository, office, isloadfile, 'sender');
    }

    async getSenderById(senderId) {
        return await this.getEntityById(senderId, senderRepository);
    }
}

module.exports = SenderService;
