import { DataSource } from 'typeorm';
import { config } from './api';
import { Airport } from '../models/airport';
import { ApiCall } from '../models/apiCall';
import { Flight } from '../models/flight';
import logger from './../config/logger';

export const AppDataSource = new DataSource({
   type: 'mysql',
   host: config.MYSQL.HOST,
   port: Number(config.MYSQL.PORT),
   username: config.MYSQL.USER,
   password: config.MYSQL.PASSWORD,
   database: config.MYSQL.DATABASE,
   entities: [Airport, Flight, ApiCall],
   synchronize: false,
   logging: false,
   migrations: ['src/migrations/*.ts'],
});

export const initializeDatabase = async () => {
   try {
      await AppDataSource.initialize();
      logger.info('Base de Datos MySQL inicializada correctamente');
   } catch (err) {
      logger.error('Error initializando la base de datos:', err);
      throw err;
   }
};
