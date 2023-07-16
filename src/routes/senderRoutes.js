const express = require('express');
const senderController = require('../controllers/senderController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Guides
 *     description: Sender operations
 *
 * components:
 *   schemas:
 *     Sender:
 *       type: object
 *       properties:
 *         sender_id:
 *           type: string
 *           description: The sender ID
 *         first_name:
 *           type: string
 *           description: The sender's first name
 *         last_name:
 *           type: string
 *           description: The sender's last name
 *         identification_type_id:
 *           type: string
 *           description: The identification type ID
 *         identification:
 *           type: string
 *           description: The sender's identification number
 *         email:
 *           type: string
 *           description: The sender's email
 *         phone:
 *           type: string
 *           description: The sender's phone number
 *         address:
 *           type: object
 *           description: The sender's address ID
 *         status:
 *           type: string
 *           description: The sender's status
 *       required:
 *         - sender_id
 *         - first_name
 *         - last_name
 *         - identification_type_id
 *         - identification
 *         - email
 *         - phone
 *         - address
 *         - status
 *
 * /senders:
 *   post:
 *     summary: Create a new sender
 *     description: Create a new sender with the provided information
 *     tags:
 *       - Guides
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sender'
 *     responses:
 *       200:
 *         description: Successfully created a new sender
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sender'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', senderController.createSender);

module.exports = router;
