# Email Setup Guide

This guide will help you set up the email functionality for your portfolio website's contact form.

## Prerequisites

Before you begin, you'll need:

1. A SMTP email service provider (Gmail, SendGrid, Mailgun, etc.)
2. Access to your hosting environment to set environment variables

## Configuration Steps

### 1. Set up Environment Variables

Copy the variables from `.env.example` to a new `.env.local` file (for local development) or set them in your hosting provider:

```
# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
EMAIL_RECIPIENT=where-to-receive@example.com
EMAIL_TEST_SECRET=your-secret-test-token
```

Replace the values with your actual SMTP settings:

- **EMAIL_HOST**: Your SMTP server address (e.g., `smtp.gmail.com` for Gmail)
- **EMAIL_PORT**: SMTP port (typically 587 for TLS or 465 for SSL)
- **EMAIL_SECURE**: Set to `true` for port 465, `false` for other ports
- **EMAIL_USER**: Your full email address
- **EMAIL_PASS**: Your email password or app password
- **EMAIL_RECIPIENT**: Where you want to receive contact form submissions
- **EMAIL_TEST_SECRET**: A secure random string to protect the test endpoint

### 2. Email Service Provider Specific Instructions

#### Gmail

If you're using Gmail, you need to:

1. Enable "Less secure app access" or
2. Create an "App Password" if you have 2-factor authentication enabled:
   - Go to your Google Account > Security
   - Under "Signing in to Google," select "App passwords"
   - Generate a new app password and use it instead of your regular password

#### SendGrid

If using SendGrid:

1. Create an API key in the SendGrid dashboard
2. Use the following settings:
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=apikey
   EMAIL_PASS=your_sendgrid_api_key
   ```

#### Mailgun

If using Mailgun:

1. Get your SMTP credentials from the Mailgun dashboard
2. Use the sandbox domain for testing or set up a custom domain
3. Configure with the provided SMTP details

### 3. Testing Your Configuration

Once you've set up your environment variables, you can test if everything is working:

1. Start your development server
2. Visit the test endpoint: `/api/test-email?secret=your-secret-test-token`
3. Check your recipient email for the test message
4. The API should return a success response if everything is configured correctly

### 4. Security Considerations

- In production, consider removing the `app/api/test-email` endpoint completely
- Never commit your .env files to version control
- Use environment variables in your hosting provider rather than .env files when possible
- Consider implementing rate limiting on your email endpoint to prevent abuse

### 5. Troubleshooting

If you're having issues:

1. Check that all environment variables are set correctly
2. Verify your SMTP credentials
3. Look for error messages in the API response
4. Check your server logs
5. Make sure your email provider allows sending through SMTP 
6. For Gmail: check if you need to allow less secure apps or create an app password

## Additional Information

The contact form sends emails through the following process:

1. User submits the contact form
2. Client-side validation occurs
3. Data is sent to the `/api/send-email` API route
4. Server validates the form data
5. Nodemailer sends the email via SMTP
6. User receives a success or error message

For detailed implementation, check:
- `components/contact-section.tsx` - Front-end form handling
- `app/api/send-email/route.ts` - API endpoint for sending emails 