# Email Configuration Guide

The mailer has been successfully configured in your NestJS application using `@nestjs-modules/mailer` with Handlebars templates.

## Setup

### 1. Environment Variables

Add these environment variables to your `.env` file:

```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM=your-email@gmail.com
MAIL_FROM_NAME=Quicko
```

### 2. Gmail Setup (if using Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password:
   - Go to Google Account settings
   - Security → App passwords
   - Generate a new app password
   - Use this app password as `MAIL_PASS`

## Usage

### 1. Import EmailService

In any module where you want to use email functionality:

```typescript
import { EmailService } from '../email/email.service';

@Module({
   imports: [EmailModule], // Import the EmailModule
   // ... other imports
})
export class YourModule {}
```

### 2. Inject EmailService

In your service or controller:

```typescript
import { EmailService } from '../email/email.service';

@Injectable()
export class YourService {
   constructor(private readonly emailService: EmailService) {}

   async someMethod() {
      // Send welcome email
      await this.emailService.sendWelcomeEmail('user@example.com', 'John Doe');

      // Send password reset email
      await this.emailService.sendPasswordResetEmail(
         'user@example.com',
         'John Doe',
         'reset-token-123',
      );

      // Send parcel status update
      await this.emailService.sendParcelStatusEmail(
         'user@example.com',
         'PKG123456',
         'delivered',
         'John Doe',
      );

      // Send custom notification
      await this.emailService.sendNotificationEmail(
         'user@example.com',
         'Custom Subject',
         'Your custom message here',
      );
   }
}
```

## Email Templates

Templates are stored in `src/templates/` directory:

- `welcome.hbs` - Welcome email template
- `reset-password.hbs` - Password reset email template

### Creating Custom Templates

1. Create a new `.hbs` file in `src/templates/`
2. Use Handlebars syntax for dynamic content:

```handlebars
<h1>Hello {{name}}!</h1>
<p>{{message}}</p>
{{#if showButton}}
   <a href='{{buttonUrl}}'>{{buttonText}}</a>
{{/if}}
```

3. Send email using the template:

```typescript
await this.mailerService.sendMail({
   to: 'user@example.com',
   subject: 'Subject',
   template: 'your-template-name', // without .hbs extension
   context: {
      name: 'John Doe',
      message: 'Your message',
      showButton: true,
      buttonUrl: 'https://example.com',
      buttonText: 'Click Here',
   },
});
```

## Available Methods

### EmailService Methods

- `sendWelcomeEmail(to, name)` - Send welcome email to new users
- `sendPasswordResetEmail(to, name, resetToken)` - Send password reset email
- `sendNotificationEmail(to, subject, message)` - Send simple notification
- `sendParcelStatusEmail(to, parcelId, status, name)` - Send parcel status updates

## Error Handling

All email methods include error handling and logging. Failed emails will throw errors that you can catch:

```typescript
try {
   await this.emailService.sendWelcomeEmail('user@example.com', 'John Doe');
   console.log('Email sent successfully');
} catch (error) {
   console.error('Failed to send email:', error);
   // Handle the error appropriately
}
```

## Testing

To test email functionality:

1. Set up a test email account (Gmail recommended)
2. Configure environment variables
3. Use the EmailService in any controller or service
4. Monitor the console for success/error messages

## Common SMTP Providers

- **Gmail**: `smtp.gmail.com:587`
- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **SendGrid**: `smtp.sendgrid.net:587`

## Security Notes

- Never commit real email credentials to version control
- Use app passwords instead of regular passwords when available
- Consider using environment-specific email configurations
- For production, consider using dedicated email services like SendGrid, AWS SES, etc.
