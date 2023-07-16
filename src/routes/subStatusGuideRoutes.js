const express = require('express');
const subStatusGuideController = require('../controllers/subStatusGuideController');

const router = express.Router();


router.get('/getSubStatusByExternalId/:sub_status_guide_external_id', subStatusGuideController.getStatusByExternalId);
router.get('/getSubStatusById/:sub_status_guide_id', subStatusGuideController.getStatusById);

module.exports = router;
