const httpResponse = require('../utils/httpResponse');
const Logger = require('../utils/logger');
const guideService = require('../services/guideService');

class GuideController {
    static logger = new Logger('guide-controller');

    static async createGuide(req, res) {
        try {
            GuideController.logger.info('Creating guide');
            const { body: guideData, query: { isloadfile: rawAllocated } } = req;
            const isloadfile = Boolean(rawAllocated);
            const guide = await guideService.createGuides(guideData, isloadfile);
            httpResponse.created(res, guide);
        } catch (error) {
            GuideController.logger.error(`Error creating guide: ${error.message}`);
            httpResponse.internalServerError(res, error.message);
        }
    };

    static async guideByNumber(req, res) {
        try {
            const { params: { guideNumber } } = req;
            GuideController.logger.info(`Getting guide for guide number = ${guideNumber}`);
            const guide = await guideService.guideByNumber(guideNumber);
            guide
                ? httpResponse.ok(res, guide)
                : httpResponse.notFound(res, `Guide not found with guide number = ${guideNumber}`);
        } catch (error) {
            GuideController.logger.error(`Error getting guide for guide number: ${error.message}`);
            httpResponse.internalServerError(res, error.message);
        }
    };

    static async guideById(req, res) {
        try {
            const { params: { guideId } } = req;
            GuideController.logger.info(`Getting guide for guide id = ${guideId}`);
            const guide = await guideService.guideById(guideId);
            guide
                ? httpResponse.ok(res, guide)
                : httpResponse.notFound(res, `Guide not found with guide id = ${guideId}`);
        } catch (error) {
            GuideController.logger.error(`Error getting guide for guide id: ${error.message}`);
            httpResponse.internalServerError(res, error.message);
        }
    };

    static async getUnassignedGuides(req, res) {
        try {
            GuideController.logger.info('Getting unassigned guides');
            const { query: { page: rawPage, pageSize: rawPageSize } } = req;
            const page = parseInt(rawPage, 10) || 1;
            const pageSize = parseInt(rawPageSize, 10) || parseInt(process.env.APP_PAGESIZE, 10);
            const guides = await guideService.getUnassignedGuides(page, pageSize);
            httpResponse.ok(res, guides);
        } catch (error) {
            GuideController.logger.error(`Error getting unassigned guides: ${error.message}`);
            httpResponse.internalServerError(res, error.message);
        }
    };
}

module.exports = GuideController;
