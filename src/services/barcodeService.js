const GuideCodeHelper = require('../helpers/guideCodeHelper');
const Logger = require('../utils/logger');

class BarcodeService {
    constructor(logger) {
        this.logger = new Logger('barcode-service');

    }

    async getQRCodeData(guideNumber) {
        const baseURL = process.env.BASE_URL || 'https://oclocl369.com';

        this.logger.info('Generation URL track.');
        if (!guideNumber) {
            throw new Error('Guide number is required');
        }

        const URL = `${baseURL}?guideNumber=${encodeURIComponent(guideNumber)}`;
        this.logger.info(`URL track for guide number ${URL}`);
        return URL;
    }

    async generateBarcode(guideNumber) {
        return await GuideCodeHelper.generateBarcode(guideNumber);
    }

    async generateQRCode(qrData) {
        return await GuideCodeHelper.generateQRCode(qrData);
    }
}

module.exports = BarcodeService;