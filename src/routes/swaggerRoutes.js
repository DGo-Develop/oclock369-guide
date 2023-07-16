const express = require('express');
const router = express.Router();
const swaggerSpec = require('../utils/swagger');

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

module.exports = router;
