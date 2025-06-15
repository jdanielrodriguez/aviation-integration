import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Aviation Integration API',
         version: '1.0.0',
         description: 'Documentación de la API para integración con AviationStack',
      },
      servers: [
         { url: 'http://localhost:8080', description: 'Desarrollo local' },
         { url: 'https://aviation-integration-944235041157.us-central1.run.app', description: 'Producción' }
      ]
   },
   apis: [
      './src/routes/*.ts',
      './src/docs/*.yaml',
   ],
};

export default swaggerJSDoc(swaggerOptions);
