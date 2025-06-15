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

   it('debería ejecutar sendAdminEmail sin lanzar errores', async () => {
      await expect(sendAdminEmail('Test Subject', 'Test Body')).resolves.not.toThrow();
   });

   it('debería loguear un error si sendMail falla', async () => {
      if (mailer) {
         jest.spyOn(mailer, 'sendMail').mockRejectedValueOnce(new Error('Fallo SMTP'));
      }
      const loggerErrorSpy = jest.spyOn(logger, 'error');
      await sendAdminEmail('Asunto Error', 'Cuerpo Error');
      expect(loggerErrorSpy).toHaveBeenCalledWith(
         'Fallo al enviar correo al administrador:',
         expect.any(Error)
      );
   });
});
