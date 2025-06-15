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

   it('debería inicializar la conexión si no está inicializada', async () => {
      if (!AppDataSource.isInitialized) {
         await AppDataSource.initialize();
      }
      expect(AppDataSource.isInitialized).toBe(true);
   });

   it('debería inicializar y correr migraciones correctamente', async () => {
      const initializeMock = jest.spyOn(AppDataSource, 'initialize').mockResolvedValueOnce(AppDataSource as any);
      const runMigrationsMock = jest.spyOn(AppDataSource, 'runMigrations').mockResolvedValueOnce([{ name: 'InitMigration' }] as any);

      await initializeDatabase();

      expect(initializeMock).toHaveBeenCalled();
      expect(runMigrationsMock).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Base de Datos MySQL inicializada correctamente');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Migraciones ejecutadas: InitMigration'));
   });

   it('debería registrar error si falla initialize', async () => {
      jest.spyOn(AppDataSource, 'initialize').mockRejectedValueOnce(new Error('Init fail'));
      await expect(initializeDatabase()).rejects.toThrow('Init fail');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error initializando la base de datos:'), expect.any(Error));
   });

   it('debería registrar error si falla runMigrations', async () => {
      jest.spyOn(AppDataSource, 'initialize').mockResolvedValueOnce(AppDataSource as any);
      jest.spyOn(AppDataSource, 'runMigrations').mockRejectedValueOnce(new Error('Migration fail'));
      await expect(initializeDatabase()).rejects.toThrow('Migration fail');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error initializando la base de datos:'), expect.any(Error));
   });
});
