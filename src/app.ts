import express from 'express';
import { createClient } from 'redis';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import airportRoutes from './routes/airportRoutes';
import flightRoutes from './routes/flightRoutes';
import healthRoutes from './routes/healthRoutes';
import { config } from './config/api';
import logger from './config/logger';

const app = express();

app.use(express.json());
app.use(requestLogger);

const redisConfig: any = {
   socket: {
      host: config.REDIS.HOST,
      port: Number(config.REDIS.PORT),
   },
   ...((config.NODE_ENV === 'production' && config.REDIS.PASSWORD) ? { password: config.REDIS.PASSWORD } : {}),
};

export const redisClient = createClient(redisConfig);

redisClient.on('error', (err) => logger.error('Redis error:', err));
redisClient.on('ready', () => logger.info('Redis conectado'));
redisClient.connect();

let mailer: ReturnType<typeof createTransport> | null = null;

if (config.NODE_ENV !== 'production' && config.MAIL.HOST && config.MAIL.PORT) {
   mailer = createTransport({
      host: config.MAIL.HOST,
      port: Number(config.MAIL.PORT),
      secure: false,
   } as SMTPTransport.Options);
   if (mailer) {
      mailer.verify(err => {
         if (err) {
            logger.error('Error verificando Mailhog/SMTP:', err);
         } else {
            logger.info('Mailer listo para enviar correos');
         }
      });
   }
} else if (config.MAIL.USER && config.MAIL.PASSWORD) {
   mailer = createTransport({
      service: 'gmail',
      auth: {
         user: config.MAIL.USER,
         pass: config.MAIL.PASSWORD,
      },
   });
   if (mailer) {
      mailer.verify(err => {
         if (err) {
            logger.error('Error verificando Gmail SMTP:', err);
         } else {
            logger.info('Gmail SMTP listo para enviar correos');
         }
      });
   }
} else {
   logger.warn('Mailer no inicializado (sin configuración SMTP)');
   mailer = null;
}

export { mailer };


app.use('/health', healthRoutes);
app.use('/api/v1/airlines', airportRoutes);
app.use('/api/v1/flights', flightRoutes);

app.use(errorHandler);

export default app;
