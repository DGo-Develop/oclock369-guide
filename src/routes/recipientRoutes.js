const express = require('express');
const recipientController = require('../controllers/recipientController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Guides
 *     description: Recipient operations
 *
 * components:
 *   schemas:
 *     Recipient:
 *       type: object
 *       properties:
 *         recipient_id:
 *           type: string
 *           description: The recipient ID
 *         first_name:
 *           type: string
 *           description: The recipient's first name
 *         last_name:
 *           type: string
 *           description: The recipient's last name
 *         identification_type_id:
 *           type: string
 *           description: The identification type ID
 *         identification:
 *           type: string
 *           description: The recipient's identification number
 *         email:
 *           type: string
 *           description: The recipient's email
 *         phone:
 *           type: string
 *           description: The recipient's phone number
 *         address_id:
 *           type: string
 *           description: The recipient's address ID
 *         status:
 *           type: string
 *           description: The recipient's status
 *       required:
 *         - recipient_id
 *         - first_name
 *         - last_name
 *         - identification_type_id
 *         - identification
 *         - email
 *         - phone
 *         - address_id
 *         - status
 *
 * /recipients:
 *   post:
 *     summary: Create a new recipient
 *     description: Create a new recipient with the provided information
 *     tags:
 *       - Guides
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipient'
 *     responses:
 *       200:
 *         description: Successfully created a new recipient
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipient'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', recipientController.createRecipient);

module.exports = router;
