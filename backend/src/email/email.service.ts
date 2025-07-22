import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { log, error } from 'console';

@Injectable()
export class EmailService {
   constructor(
      private readonly mailerService: MailerService,
      private readonly configService: ConfigService,
   ) {}

   async sendWelcomeEmail(to: string, name: string) {
      try {
         await this.mailerService.sendMail({
            to,
            subject: `Welcome to ${this.configService.get('api.config.appName')}!`,
            template: 'welcome',
            context: {
               name,
               appName: this.configService.get('api.config.appName') as string,
               message:
                  'Your account has been successfully created. Start managing your parcels today!',
               actionUrl: this.configService.get('api.config.appUrl') as string,
               actionText: 'Get Started',
            },
         });

         log(`Welcome email sent successfully to ${to}`);
      } catch (err) {
         error('Failed to send welcome email:', err);
         throw err;
      }
   }

   async sendPasswordResetEmail(to: string, name: string, resetToken: string) {
      const resetUrl = `${this.configService.get('api.config.appUrl')}/reset-password?token=${resetToken}`;

      try {
         await this.mailerService.sendMail({
            to,
            subject: 'Password Reset Request',
            template: 'reset-password',
            context: {
               name,
               appName: this.configService.get('api.config.appName') as string,
               resetUrl,
               expirationTime: 30, // 30 minutes
            },
         });

         log(`Password reset email sent successfully to ${to}`);
      } catch (err) {
         error('Failed to send password reset email:', err);
         throw err;
      }
   }

   async sendNotificationEmail(to: string, subject: string, message: string) {
      try {
         await this.mailerService.sendMail({
            to,
            subject,
            html: `
               <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #333;">${subject}</h2>
                  <p style="line-height: 1.6; color: #555;">${message}</p>
                  <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                  <p style="font-size: 12px; color: #999;">
                     This email was sent from ${this.configService.get('api.config.appName')}
                  </p>
               </div>
            `,
         });

         log(`Notification email sent successfully to ${to}`);
      } catch (err) {
         error('Failed to send notification email:', err);
         throw err;
      }
   }

   async sendParcelStatusEmail(
      to: string,
      parcelId: string,
      status: string,
      name: string,
   ) {
      const statusMessages = {
         pending: 'Your parcel has been received and is being processed.',
         'in-transit': 'Your parcel is now in transit to the destination.',
         'out-for-delivery':
            'Your parcel is out for delivery and will arrive soon.',
         delivered: 'Your parcel has been successfully delivered.',
         'failed-delivery': 'Delivery attempt failed. We will try again soon.',
      };

      try {
         await this.mailerService.sendMail({
            to,
            subject: `Parcel Update - ${parcelId}`,
            html: `
               <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                     <h1 style="color: #2563eb; margin: 0;">Parcel Status Update</h1>
                  </div>
                  
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                     <h2 style="margin-top: 0; color: #333;">Hello ${name}!</h2>
                     <p style="font-size: 16px; margin: 15px 0;">
                        Your parcel <strong>${parcelId}</strong> status has been updated to: 
                        <span style="color: #2563eb; font-weight: bold; text-transform: uppercase;">${status}</span>
                     </p>
                     <p style="color: #666; line-height: 1.6;">
                        ${statusMessages[status] || 'Your parcel status has been updated.'}
                     </p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                     <a href="${this.configService.get('api.config.appUrl')}/parcels/${parcelId}" 
                        style="background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
                        Track Parcel
                     </a>
                  </div>
                  
                  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                  <p style="font-size: 12px; color: #999; text-align: center;">
                     This email was sent from ${this.configService.get('api.config.appName')}<br>
                     &copy; 2025 ${this.configService.get('api.config.appName')}. All rights reserved.
                  </p>
               </div>
            `,
         });

         log(
            `Parcel status email sent successfully to ${to} for parcel ${parcelId}`,
         );
      } catch (err) {
         error('Failed to send parcel status email:', err);
         throw err;
      }
   }
}
