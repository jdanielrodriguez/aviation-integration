import { AppDataSource, initializeDatabase } from '../../../config/database';
import logger from '../../../config/logger';

describe('database connection', () => {
   afterEach(() => {
      jest.clearAllMocks();
   });

   beforeEach(() => {
      (logger.info as jest.Mock) = jest.fn();
      (logger.error as jest.Mock) = jest.fn();
   });

   it('should initialize the connection if it is not initialized', async () => {
      if (!AppDataSource.isInitialized) {
         await AppDataSource.initialize();
      }
      expect(AppDataSource.isInitialized).toBe(true);
   });

   it('should initialize and run migrations correctly', async () => {
      const initializeMock = jest.spyOn(AppDataSource, 'initialize').mockResolvedValueOnce(AppDataSource as any);
      const runMigrationsMock = jest.spyOn(AppDataSource, 'runMigrations').mockResolvedValueOnce([{ name: 'InitMigration' }] as any);

      await initializeDatabase();

      expect(initializeMock).toHaveBeenCalled();
      expect(runMigrationsMock).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('MySQL Database initialized successfully');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Migrations executed: InitMigration'));
   });

   it('should log error if initialize fails', async () => {
      jest.spyOn(AppDataSource, 'initialize').mockRejectedValueOnce(new Error('Init fail'));
      await expect(initializeDatabase()).rejects.toThrow('Init fail');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error initializing the database:'), expect.any(Error));
   });

   it('should log error if runMigrations fails', async () => {
      jest.spyOn(AppDataSource, 'initialize').mockResolvedValueOnce(AppDataSource as any);
      jest.spyOn(AppDataSource, 'runMigrations').mockRejectedValueOnce(new Error('Migration fail'));
      await expect(initializeDatabase()).rejects.toThrow('Migration fail');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error initializing the database:'), expect.any(Error));
   });
});
