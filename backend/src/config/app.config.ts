import { registerAs } from '@nestjs/config';

export default registerAs('api.config', () => ({
   appName: 'Quicko - Your personal delivery assistant',
   appUrl: process.env.APP_URL ?? 'http://localhost:8080',
   apiUrl: process.env.API_URL ?? 'http://localhost:3333',
}));
