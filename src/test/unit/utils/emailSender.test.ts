jest.mock('../../../config/logger', () => ({
   error: jest.fn(),
   warn: jest.fn(),
   info: jest.fn(),
}));

jest.mock('nodemailer', () => ({
   createTransport: jest.fn(() => ({
      sendMail: jest.fn(),
      verify: jest.fn(cb => cb && cb(null)),
   })),
}));

jest.mock('../../../config/api', () => ({
   config: {
      NODE_ENV: 'production',
      MAIL: {
         USER: 'fake_user@example.com',
         PASSWORD: 'fake_password',
         FROM: 'from@example.com',
         TO: 'to@example.com'
      },
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

describe('emailSender', () => {
   afterEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
   });

   it('should execute sendAdminEmail without throwing errors', async () => {
      const { sendAdminEmail } = require('../../../utils/emailSender');
      await expect(sendAdminEmail('Test Subject', 'Test Body')).resolves.not.toThrow();
   });

   it('should initialize Gmail SMTP if MAIL.USER and MAIL.PASSWORD are set', () => {
      jest.resetModules();
      const { mailer } = require('../../../app');
      expect(mailer).not.toBeNull();
      expect(mailer.verify).toBeDefined();
   });

   it('should log an error if sendMail fails', async () => {
      jest.resetModules();
      const logger = require('../../../config/logger');
      const loggerErrorSpy = jest.spyOn(logger, 'error');
      const { mailer } = require('../../../app');
      if (mailer && typeof mailer.sendMail === 'function') {
         jest.spyOn(mailer, 'sendMail').mockRejectedValueOnce(new Error('SMTP failure'));
      }
      const { sendAdminEmail } = require('../../../utils/emailSender');
      await sendAdminEmail('Error Subject', 'Error Body');
      expect(loggerErrorSpy).toHaveBeenCalledWith(
         'Failed to send email to administrator:',
         expect.any(Error)
      );
   });

   it('should log warning and set mailer to null if no SMTP config', () => {
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

   it('should log error if Mailhog/SMTP verification fails', () => {
      jest.resetModules();

      jest.doMock('../../../config/api', () => ({
         config: {
            NODE_ENV: 'development',
            MAIL: {
               HOST: 'localhost',
               PORT: 1025,
            },
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

      jest.doMock('nodemailer', () => ({
         createTransport: jest.fn(() => ({
            verify: jest.fn(cb => cb && cb(new Error('fail mailhog'))),
            sendMail: jest.fn(),
         })),
      }));

      const logger = require('../../../config/logger');
      const errorSpy = jest.spyOn(logger, 'error');
      require('../../../app');

      expect(errorSpy).toHaveBeenCalledWith('Error verifying Mailhog/SMTP:', expect.any(Error));
   });
   it('should log error if Gmail SMTP verification fails', () => {
      jest.resetModules();

      jest.doMock('../../../config/api', () => ({
         config: {
            NODE_ENV: 'production',
            MAIL: {
               USER: 'gmail_user',
               PASSWORD: 'gmail_pass',
            },
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

      jest.doMock('nodemailer', () => ({
         createTransport: jest.fn(() => ({
            verify: jest.fn(cb => cb && cb(new Error('fail gmail'))),
            sendMail: jest.fn(),
         })),
      }));

      const logger = require('../../../config/logger');
      const errorSpy = jest.spyOn(logger, 'error');
      require('../../../app');

      expect(errorSpy).toHaveBeenCalledWith('Error verifying Gmail SMTP:', expect.any(Error));
   });

});
