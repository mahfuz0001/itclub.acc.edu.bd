# Email Notification System

This system automatically sends email notifications when membership applications are approved or rejected.

## Features

### Welcome Email (for approved applications)
- Personalized welcome message with member's name
- Club information and next steps
- Group chat links (Messenger and Instagram)
- Professional HTML template with club branding

### Rejection Email (for rejected applications)
- Polite rejection message
- Encouragement to apply again in the future
- Professional and respectful tone

## Configuration

### Required Environment Variables

Add these to your `.env.local` file:

```bash
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@itclub.acc.edu.bd
CONTACT_EMAIL=itclub@acc.edu.bd

# Group Chat Links
NEXT_PUBLIC_MESSENGER_GROUP_LINK=https://m.me/j/your_messenger_group_link
NEXT_PUBLIC_INSTAGRAM_GROUP_LINK=https://ig.me/j/your_instagram_group_link
```

### Gmail Setup (Example)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use the generated password as `SMTP_PASS`

### Other Email Providers

The system supports any SMTP provider. Common configurations:

**Outlook/Hotmail:**
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Yahoo Mail:**
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

## API Usage

### Send Welcome Email
```javascript
POST /api/send-email
{
  "type": "welcome",
  "to": "member@example.com",
  "memberName": "John Doe",
  "messengerGroupLink": "https://m.me/j/...",
  "instagramGroupLink": "https://ig.me/j/..."
}
```

### Send Rejection Email
```javascript
POST /api/send-email
{
  "type": "rejection",
  "to": "member@example.com",
  "memberName": "John Doe"
}
```

## How It Works

1. Admin approves/rejects an application in the admin panel
2. Application status is updated in Firebase
3. Email notification is automatically sent to the applicant
4. Success/failure feedback is shown to the admin

## Error Handling

- If email sending fails, the application status is still updated
- Admin receives a warning notification about email failure
- Detailed error logs are available in the server console
- Graceful fallback ensures the core functionality isn't disrupted

## Security

- SMTP credentials are stored as environment variables
- Email content is sanitized and validated
- Rate limiting is handled by the middleware
- No sensitive information is logged

## Customization

### Email Templates
Email templates are located in `lib/email/templates.ts`. You can customize:
- HTML styling and layout
- Email content and messaging
- Brand colors and logos
- Additional email types

### Group Chat Links
Update the links in your environment variables or directly in the site configuration.

## Troubleshooting

### Common Issues

1. **"SMTP credentials not configured"**
   - Ensure `SMTP_USER` and `SMTP_PASS` are set in your environment

2. **"Authentication failed"**
   - Check your email and password
   - For Gmail, ensure you're using an App Password, not your regular password

3. **"Connection timeout"**
   - Check `SMTP_HOST` and `SMTP_PORT` settings
   - Ensure your server can access the SMTP provider

4. **Emails not being received**
   - Check spam/junk folders
   - Verify the recipient email address
   - Check email server logs for delivery status

### Debug Mode

To enable detailed email debugging, add to your environment:
```bash
DEBUG=nodemailer:*
```