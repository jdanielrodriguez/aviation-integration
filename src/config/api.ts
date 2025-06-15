import dotenv from 'dotenv';

dotenv.config();

export function required(key: string): string {
   const value = process.env[key];
   if (!value) throw new Error(`Config error: Missing env var ${key}`);
   return value;
}

export const isTestEnv = process.env.NODE_ENV === 'test';

export const config = {
   NODE_ENV: process.env.NODE_ENV || 'development',
   PORT: process.env.PORT || process.env.DEFAULT_PORT || '8080',
   AVIATIONSTACK_KEY: required('AVIATIONSTACK_KEY'),
   AVIATIONSTACK_URL: required('AVIATIONSTACK_URL') || 'https://api.aviationstack.com/v1',
   MYSQL: {
      HOST: required('MYSQL_HOST'),
      PORT: process.env.MYSQL_PORT || '3306',
      USER: required('MYSQL_USER'),
      PASSWORD: required('MYSQL_PASSWORD'),
      DATABASE: required('MYSQL_DATABASE'),
   },
   REDIS: {
      HOST: process.env.REDIS_HOST || 'aviation_redis',
      PASSWORD: process.env.REDIS_PASSWORD || '',
      PORT: process.env.REDIS_PORT || '6379',
   },
   MAIL: {
      HOST: process.env.MAIL_HOST || 'aviation_mailhog',
      USER: process.env.GMAIL_USER || '',
      PASSWORD: process.env.GMAIL_PASS || '',
      PORT: process.env.MAIL_PORT || '1025',
      FROM: process.env.MAIL_FROM || 'alertas@aviation.com',
      TO: process.env.MAIL_TO || 'admin@aviation.com'
   }
};
