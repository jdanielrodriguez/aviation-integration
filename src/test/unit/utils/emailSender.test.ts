import { sendAdminEmail } from '../../../utils/emailSender';
import { mailer } from '../../../app';
import logger from '../../../config/logger';

jest.mock('../../../config/logger', () => ({
   error: jest.fn(),
   warn: jest.fn(),
   info: jest.fn(),
}));

describe('emailSender', () => {
   afterEach(() => {
      jest.clearAllMocks();
   });

   it('should execute sendAdminEmail without throwing errors', async () => {
      await expect(sendAdminEmail('Test Subject', 'Test Body')).resolves.not.toThrow();
   });

   it('should log an error if sendMail fails', async () => {
      if (mailer) {
         jest.spyOn(mailer, 'sendMail').mockRejectedValueOnce(new Error('SMTP failure'));
      }
      const loggerErrorSpy = jest.spyOn(logger, 'error');
      await sendAdminEmail('Error Subject', 'Error Body');
      expect(loggerErrorSpy).toHaveBeenCalledWith(
         'Failed to send email to administrator:',
         expect.any(Error)
      );
   });
});
