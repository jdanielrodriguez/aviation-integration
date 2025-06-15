import app from './app';
import { config } from './config/api';
import logger from './config/logger';
import { initializeDatabase } from './config/database';

initializeDatabase()
   .then(() => {
      app.listen(config.PORT, () => {
         logger.info(`Servidor corriendo en puerto ${config.PORT} on ${config.NODE_ENV} mode`);
      });
   })
   .catch((err) => {
      logger.error('No se pudo inicializar la base de datos', err);
      process.exit(1);
   });
