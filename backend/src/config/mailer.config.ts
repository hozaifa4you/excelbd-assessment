import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
   transport: {
      host: process.env.MAIL_HOST ?? 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT ?? '587', 10),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
         user: process.env.MAIL_USER,
         pass: process.env.MAIL_PASS,
      },
   },
   defaults: {
      from: `"${process.env.MAIL_FROM_NAME ?? 'Quicko'}" <${process.env.MAIL_FROM ?? process.env.MAIL_USER}>`,
   },
   template: {
      dir: process.cwd() + '/src/templates',
      adapter: 'handlebars',
      options: {
         strict: true,
      },
   },
}));
