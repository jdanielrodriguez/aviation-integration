import app from './app';
import { config } from './config/api';
import logger from './config/logger';
import { initializeDatabase } from './config/database';

initializeDatabase()
   .then(() => {
      app.listen(config.PORT, () => {
         logger.info(`Server running on port ${config.PORT} and ${config.NODE_ENV} mode`);
      });
   })
   .catch((err) => {
      logger.error('The database could not be initialized', err);
      process.exit(1);
   });
