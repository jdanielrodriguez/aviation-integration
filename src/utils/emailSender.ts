import { mailer } from '../app';
import logger from '../config/logger';

export async function sendAdminEmail(subject: string, message: string) {
   if (!mailer) {
      logger.warn('Mailer no disponible para enviar correo de error crítico');
      return;
   }

   try {
      await mailer.sendMail({
         from: 'alertas@aviation.com',
         to: 'admin@aviation.com',
         subject,
         text: message,
      });
   } catch (err) {
      logger.error('Fallo al enviar correo al administrador:', err);
   }
}
