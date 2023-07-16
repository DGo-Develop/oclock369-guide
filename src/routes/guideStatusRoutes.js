const express = require('express');
const guideStatusController = require('../controllers/guideStatusController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Guides
 *     description: Retrieve guide statuses
 * components:
 *   schemas:
 *     GuideStatus:
 *       type: object
 *       properties:
 *         guide_status_id:
 *           type: string
 *           description: The guide status ID
 *         name:
 *           type: string
 *           description: The name of the guide status
 *         status:
 *           type: boolean
 *           description: The status of the guide status
 *       required:
 *         - guide_status_id
 *         - name
 *         - status
 *
 * /status:
 *   get:
 *     summary: Get guide statuses
 *     description: Retrieve a list of guide statuses
 *     tags:
 *       - Guides
 *     responses:
 *       200:
 *         description: Successfully retrieved guide statuses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GuideStatus'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/', guideStatusController.getAllGuideStatuses);

router.get('/getByName/:statusName', guideStatusController.getStatusByName);

router.get('/getStatusByExternalId/:status_guide_external_id', guideStatusController.getStatusByExternalId);

router.get('/getById/:status_guide_id', guideStatusController.getStatusById);

module.exports = router;
