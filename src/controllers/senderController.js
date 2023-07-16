const httpResponse = require('../utils/httpResponse');
const Logger = require('../utils/logger');
const SenderService = require('../services/senderService');

this.logger = new Logger('sender-controller');

const createSender = async (req, res) => {
    try {
        this.logger.info('Creating sender');
        const senderData = req.body;
        const senderService = new SenderService();
        const newSender = await senderService.createOrValidateSender(senderData);

        if (!newSender.status) {
            httpResponse.conflict(res, newSender.message);
        }

        httpResponse.ok(res, newSender.sender);
    } catch (error) {
        this.logger.error(`Error creating sender: ${error.message}`);
        httpResponse.internalServerError(res, error.message);
    }
};

module.exports = {
    createSender
};
