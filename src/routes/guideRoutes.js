const express = require('express');
const guideController = require('../controllers/guideController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Guides
 *   description: Operations with guides
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new guide
 *     description: Create a new guide with the provided data
 *     tags:
 *       - Guides
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Guide'
 *     responses:
 *       201:
 *         description: Guide created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guide_id:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Internal server error
 */
router.post('/', guideController.createGuide);

/**
 * @swagger
 * /guideByNumber/:guideNumber:
 *   get:
 *     summary: Get guide by guide number
 *     description: Retrieve a guide using its guide number
 *     tags:
 *       - Guides
 *     parameters:
 *       - in: path
 *         name: guideNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The guide number to retrieve
 *     responses:
 *       200:
 *         description: Guide retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Internal server error
 */
router.get('/guideByNumber/:guideNumber', guideController.guideByNumber);

/**
 * @swagger
 * /unassignedGuides:
 *   get:
 *     summary: Get guide unassigned guides
 *     description: Retrieve a guide pending assing
 *     tags:
 *       - Guides
 *     responses:
 *       200:
 *         description: Guide retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Internal server error
 */
router.get('/unassigned', guideController.getUnassignedGuides);


/**
 * @swagger
 * /:guideId:
 *   get:
 *     summary: Get guide by guide number
 *     description: Retrieve a guide using its guide number
 *     tags:
 *       - Guides
 *     parameters:
 *       - in: path
 *         name: guideId
 *         schema:
 *           type: string
 *         required: true
 *         description: The guide number to retrieve
 *     responses:
 *       200:
 *         description: Guide retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Internal server error
 */
router.get('/:guideId', guideController.guideById);

module.exports = router;
