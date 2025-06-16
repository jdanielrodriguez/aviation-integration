jest.mock('../../../config/logger', () => ({
   error: jest.fn(),
   warn: jest.fn(),
   info: jest.fn(),
}));

describe('config/api.ts', () => {
   const OLD_ENV = { ...process.env };

   beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
      process.env = { ...OLD_ENV };
   });

   afterEach(() => {
      process.env = { ...OLD_ENV };
   });

   it('should fallback to default ports and URLs if env vars not set', () => {
      delete process.env.PORT;
      delete process.env.AVIATIONSTACK_URL;
      delete process.env.REDIS_HOST;
      delete process.env.REDIS_PORT;
      delete process.env.MAIL_HOST;
      delete process.env.MAIL_PORT;
      delete process.env.MAIL_FROM;
      delete process.env.MAIL_TO;

      process.env.AVIATIONSTACK_KEY = 'KEY';
      process.env.MYSQL_HOST = 'localhost';
      process.env.MYSQL_USER = 'user';
      process.env.MYSQL_PASSWORD = 'pass';
      process.env.MYSQL_DATABASE = 'db';

      const { config } = require('../../../config/api');

      expect(config.PORT).toBe('8080');
      expect(config.AVIATIONSTACK_URL).toBe('https://api.aviationstack.com/v1');
      expect(config.REDIS.HOST).toBe('aviation_redis');
      expect(config.REDIS.PORT).toBe('6379');
      expect(config.MAIL.HOST).toBe('aviation_mailhog');
      expect(config.MAIL.PORT).toBe('1025');
      expect(config.MAIL.FROM).toBe('alertas@aviation.com');
      expect(config.MAIL.TO).toBe('admin@aviation.com');
   });

   it('should use custom values if env vars set', () => {
      process.env.AVIATIONSTACK_KEY = 'K';
      process.env.AVIATIONSTACK_URL = 'U';
      process.env.MYSQL_HOST = 'h';
      process.env.MYSQL_USER = 'u';
      process.env.MYSQL_PASSWORD = 'p';
      process.env.MYSQL_DATABASE = 'd';
      process.env.PORT = '1111';
      process.env.REDIS_HOST = 'redisx';
      process.env.REDIS_PORT = '1212';
      process.env.MAIL_HOST = 'mailx';
      process.env.MAIL_PORT = '2222';
      process.env.MAIL_FROM = 'f@x.com';
      process.env.MAIL_TO = 't@x.com';

      delete require.cache[require.resolve('../../../config/api')];
      const { config } = require('../../../config/api');

      expect(config.PORT).toBe('1111');
      expect(config.AVIATIONSTACK_URL).toBe('U');
      expect(config.REDIS.HOST).toBe('redisx');
      expect(config.REDIS.PORT).toBe('1212');
      expect(config.MAIL.HOST).toBe('mailx');
      expect(config.MAIL.PORT).toBe('2222');
      expect(config.MAIL.FROM).toBe('f@x.com');
      expect(config.MAIL.TO).toBe('t@x.com');
   });

   it('should throw error if the variable does not exist', () => {
      delete process.env.NO_EXISTE_VAR;
      delete require.cache[require.resolve('../../../config/api')];
      const { required } = require('../../../config/api');
      expect(() => required('NO_EXISTE_VAR')).toThrow(/NO_EXISTE_VAR/);
   });

   it('should return the value if the variable exists', () => {
      process.env.SI_EXISTE_VAR = 'x';
      delete require.cache[require.resolve('../../../config/api')];
      const { required } = require('../../../config/api');
      expect(required('SI_EXISTE_VAR')).toBe('x');
   });

   it('should add redis password in production config', () => {
      jest.resetModules();
      jest.doMock('../../../config/api', () => ({
         config: {
            NODE_ENV: 'production',
            REDIS: {
               HOST: 'localhost',
               PORT: 6379,
               PASSWORD: 'somepass',
            },
            MAIL: {},
            MYSQL: {},
         }
      }));
      require('../../../app');
   });

   it('should call redisClient.quit in test env', () => {
      process.env.NODE_ENV = 'test';
      jest.resetModules();
      // Mock config/api
      jest.doMock('../../../config/api', () => ({
         config: {
            NODE_ENV: 'test',
            REDIS: {
               HOST: 'localhost',
               PORT: 6379,
               PASSWORD: '',
            },
            MAIL: {},
            MYSQL: {},
         }
      }));
      // Mock redis client
      const quitMock = jest.fn().mockResolvedValue(undefined);
      jest.doMock('redis', () => ({
         createClient: jest.fn(() => ({
            on: jest.fn(),
            connect: jest.fn(),
            quit: quitMock,
         })),
      }));

      require('../../../app');
      expect(quitMock).toHaveBeenCalled();
      process.env.NODE_ENV = 'test'; // Restore (por si acaso)
   });

   it('should call mailer.verify for SMTP', () => {
      jest.resetModules();
      jest.doMock('../../../config/api', () => ({
         config: {
            NODE_ENV: 'development',
            MAIL: {
               HOST: 'mailhost',
               PORT: 1025,
            },
            REDIS: {},
            MYSQL: {},
         }
      }));
      const verifyMock = jest.fn();
      jest.doMock('nodemailer', () => ({
         createTransport: jest.fn(() => ({
            verify: verifyMock,
            sendMail: jest.fn(),
         })),
      }));

      require('../../../app');
      expect(verifyMock).toHaveBeenCalled();
   });

   it('should call mailer.verify for Gmail', () => {
      jest.resetModules();
      jest.doMock('../../../config/api', () => ({
         config: {
            NODE_ENV: 'production',
            MAIL: {
               USER: 'gmail_user',
               PASSWORD: 'gmail_pass',
            },
            REDIS: {},
            MYSQL: {},
         }
      }));
      const verifyMock = jest.fn();
      jest.doMock('nodemailer', () => ({
         createTransport: jest.fn(() => ({
            verify: verifyMock,
            sendMail: jest.fn(),
         })),
      }));

      require('../../../app');
      expect(verifyMock).toHaveBeenCalled();
   });

   it('should leave mailer as null if no SMTP config present', () => {
      jest.resetModules();

      jest.doMock('../../../config/api', () => ({
         config: {
            NODE_ENV: 'production',
            MAIL: {},
            REDIS: {
               HOST: 'localhost',
               PORT: 6379,
               PASSWORD: '',
            },
            MYSQL: {
               HOST: 'localhost',
               PORT: 3306,
               USER: 'test',
               PASSWORD: 'test',
               DATABASE: 'test',
            }
         }
      }));

      const logger = require('../../../config/logger');
      const warnSpy = jest.spyOn(logger, 'warn');

      const { mailer } = require('../../../app');
      expect(mailer).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Mailer not initialized'));
   });

});
