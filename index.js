require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/utils/swagger');
const senderRoutes = require('./src/routes/senderRoutes');
const recipientRoutes = require('./src/routes/recipientRoutes');
const guideRoutes = require('./src/routes/guideRoutes');
const guideStatusRoutes = require('./src/routes/guideStatusRoutes');
const subStatusGuideRoutes = require('./src/routes/subStatusGuideRoutes');
const swaggerRoutes = require('./src/routes/swaggerRoutes');
const Logger = require('./src/utils/logger');
this.logger = new Logger('index-service');
const subStatusGuideService = require('./src/services/subStatusGuideService');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware para registrar todas las solicitudes
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    this.logger.info(`{[timestamp: ${timestamp}] 
                        method: ${req.method} 
                        originalUrl: ${req.originalUrl} 
                        body:${JSON.stringify(req.body)} 
                        params:${JSON.stringify(req.params)}  
                        query:${JSON.stringify(req.query)}}`);
    next();
});

app.use('/status', guideStatusRoutes);
app.use('/sub-status', subStatusGuideRoutes);
app.use('/', guideRoutes);
app.use('/senders', senderRoutes);
app.use('/recipients', recipientRoutes);
app.use('/docs/json', swaggerRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 3000;
app.listen(port, () => {

    // Ejecutar la tarea inmediatamente al iniciar el servicio
    subStatusGuideService.fetchAndStoreSubStatuses();

    // Programar la tarea para ejecutarse cada día a las 00:00
    cron.schedule('0 0 * * *', () => {
        subStatusGuideService.fetchAndStoreSubStatuses();
    });

    this.logger.info(`Server listening on port ${port}`);
});
