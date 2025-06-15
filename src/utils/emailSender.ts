import { mailer } from '../app';
import logger from '../config/logger';
import { config } from '../config/api';

export async function sendAdminEmail(subject: string, message: string) {
   if (!mailer) {
      logger.warn('Mailer not available to send critical error mail');
      return;
   }

   try {
      await mailer.sendMail({
         from: config.MAIL.FROM,
         to: config.MAIL.TO,
         subject,
         text: message,
      });
   } catch (err) {
      logger.error('Failed to send email to administrator:', err);
   }
}
