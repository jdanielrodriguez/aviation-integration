import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Aviation Integration API',
         version: '1.0.0',
         description: 'API documentation for integration with AviationStack',
      },
      servers: [
         { url: 'https://aviation-integration-944235041157.us-central1.run.app', description: 'Production' },
         { url: 'http://localhost:8080', description: 'Local development' }
      ]
   },
   apis: [
      './src/routes/*.ts',
      './src/docs/*.yaml',
   ],
};

export default swaggerJSDoc(swaggerOptions);
