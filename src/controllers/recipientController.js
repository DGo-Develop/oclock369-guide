const httpResponse = require('../utils/httpResponse');
const Logger = require('../utils/logger');
const RecipientService = require('../services/recipientService');

this.logger = new Logger('recipient-controller');

const createRecipient = async (req, res) => {
    try {
        this.logger.info('Creating recipient');
        const recipientData = req.body;
        const recipientService = new RecipientService();
        const newrecipient = await recipientService.createOrValidaterecipient(recipientData);

        if (!newrecipient.status) {
            httpResponse.conflict(res, newrecipient.message);
        }

        httpResponse.ok(res, newrecipient.recipient);
    } catch (error) {
        this.logger.error(`Error creating recipient: ${error.message}`);
        httpResponse.internalServerError(res, error.message);
    }
};

module.exports = {
    createRecipient
};
