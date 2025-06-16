import { DataSource } from 'typeorm';
import { config } from './api';
import { Airport } from '../models/airport';
import { ApiCall } from '../models/apiCall';
import { Flight } from '../models/flight';
import { Airline } from '../models/airline';
import logger from './../config/logger';

export const AppDataSource = new DataSource({
   type: 'mysql',
   host: config.MYSQL.HOST,
   port: Number(config.MYSQL.PORT),
   username: config.MYSQL.USER,
   password: config.MYSQL.PASSWORD,
   database: config.MYSQL.DATABASE,
   entities: [Airport, Flight, ApiCall, Airline],
   synchronize: false,
   logging: false,
   migrations: ['dist/migrations/*.js'],
});

export const initializeDatabase = async () => {
   try {
      await AppDataSource.initialize();
      logger.info('MySQL Database initialized successfully');
      const migrations = await AppDataSource.runMigrations();
      logger.info(`Migrations executed: ${migrations.map(m => m.name).join(', ')}`);
   } catch (err) {
      logger.error('Error initializing the database:', err);
      throw err;
   }
};
