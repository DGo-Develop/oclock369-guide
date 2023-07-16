const BaseEntityService = require('./baseEntityService');
const recipientRepository = require('../repositories/recipientRepository');

class RecipientService extends BaseEntityService {
    constructor(identificationTypes, cities, departments){
        super(identificationTypes, cities, departments)
    }

    async createOrValidateRecipient(recipientData, office, isloadfile) {
        return await this.createOrValidateEntity(recipientData, recipientRepository, office, isloadfile, 'recipient');
    }
    async getRecipientById(recipientId) {
        return await this.getEntityById(recipientId, recipientRepository);
    }
}

module.exports = RecipientService;
