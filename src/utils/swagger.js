const swaggerJSDoc = require('swagger-jsdoc');
const swaggerSchemas = require('./swaggerSchemas')

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Track 369: Guide API',
        version: '1.0.0',
        description: 'API para el servicio de gestión de las guias procesadas por la aplicación Track 369.',
    },
    components: {
        schemas: swaggerSchemas,
    }
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
