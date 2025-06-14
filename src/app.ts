import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet());
app.use(cookieParser());

const allowedOrigins = [
   'http://localhost:8080',
   'https://aviation-integration-944235041157.us-central1.run.app'
];

app.use(cors({
   origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
         return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
   }
}));

const apiLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   standardHeaders: true,
   legacyHeaders: false,
   message: { error: "Demasiadas solicitudes, por favor intenta más tarde." }
});
app.use('/api', apiLimiter);

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

app.use('/api/health', healthRoutes);
app.use('/api/v1/airlines', airportRoutes);
app.use('/api/v1/flights', flightRoutes);
app.get('/api/test-error', (_req, _res) => {
   throw new Error('Error de prueba');
});
app.get('/', (_req, res) => {
   const readmePath = path.join(__dirname, '../README.md');
   fs.readFile(readmePath, 'utf8', (err, data) => {
      if (err) {
         return res.status(500).send('No se pudo cargar el README.md');
      }
      res.type('text/plain').send(data);
   });
});
app.use((req, res, next) => {
   res.status(404).json({
      error: 'Ruta no encontrada',
      path: req.originalUrl
   });
});

app.use(errorHandler);

export default app;
