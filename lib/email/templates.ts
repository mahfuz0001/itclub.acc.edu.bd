export interface WelcomeEmailData {
  memberName: string;
  messengerGroupLink?: string;
  instagramGroupLink?: string;
}

export function generateWelcomeEmailTemplate(data: WelcomeEmailData): { html: string; text: string } {
  const { memberName, messengerGroupLink, instagramGroupLink } = data;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ACCITC!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            color: #3b82f6;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .title {
            color: #2563eb;
            font-size: 20px;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 25px;
        }
        .group-links {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .group-link {
            display: block;
            color: #3b82f6;
            text-decoration: none;
            margin: 10px 0;
            padding: 8px 12px;
            background-color: #ffffff;
            border-radius: 5px;
            border: 1px solid #e2e8f0;
        }
        .group-link:hover {
            background-color: #f1f5f9;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }
        .signature {
            margin-top: 25px;
            color: #475569;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">ACCITC</div>
            <h1 class="title">Welcome to the Club! You're officially in!</h1>
        </div>
        
        <div class="content">
            <p>Hi <strong>${memberName}</strong>,</p>
            
            <p>A huge welcome to the club! We're so excited to have you join our community. We know you're going to be a fantastic addition to the group.</p>
            
            <p>We've got a lot of exciting things planned, and the best way to stay in the loop is by joining our group chats. This is where we share updates, plan events, and just hang out and chat.</p>
            
            ${(messengerGroupLink || instagramGroupLink) ? `
            <div class="group-links">
                <p><strong>Here are the links to join:</strong></p>
                ${messengerGroupLink ? `<a href="${messengerGroupLink}" class="group-link">📱 Messenger Group Chat</a>` : ''}
                ${instagramGroupLink ? `<a href="${instagramGroupLink}" class="group-link">📸 Instagram Group Chat</a>` : ''}
            </div>
            ` : ''}
            
            <p>Please feel free to jump right in and say hello! We can't wait to get to know you.</p>
            
            <p>If you have any questions at all, just reply to this email. We're always here to help.</p>
        </div>
        
        <div class="signature">
            <p>Cheers,<br>
            <strong>ACCITC Executive Members</strong></p>
        </div>
        
        <div class="footer">
            <p>Adamjee Cantonment College IT Club<br>
            <a href="mailto:itclub@acc.edu.bd">itclub@acc.edu.bd</a></p>
        </div>
    </div>
</body>
</html>`;

  const text = `
Welcome to the Club! You're officially in!

Hi ${memberName},

A huge welcome to the club! We're so excited to have you join our community. We know you're going to be a fantastic addition to the group.

We've got a lot of exciting things planned, and the best way to stay in the loop is by joining our group chats. This is where we share updates, plan events, and just hang out and chat.

${(messengerGroupLink || instagramGroupLink) ? `
Here are the links to join:

${messengerGroupLink ? `Messenger Group Chat: ${messengerGroupLink}` : ''}
${instagramGroupLink ? `Instagram Group Chat: ${instagramGroupLink}` : ''}
` : ''}

Please feel free to jump right in and say hello! We can't wait to get to know you.

If you have any questions at all, just reply to this email. We're always here to help.

Cheers,
ACCITC Executive Members

---
Adamjee Cantonment College IT Club
itclub@acc.edu.bd
`;

  return { html, text };
}

export function generateRejectionEmailTemplate(memberName: string): { html: string; text: string } {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Update - ACCITC</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            color: #3b82f6;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .title {
            color: #dc2626;
            font-size: 20px;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 25px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }
        .signature {
            margin-top: 25px;
            color: #475569;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">ACCITC</div>
            <h1 class="title">Application Update</h1>
        </div>
        
        <div class="content">
            <p>Hi <strong>${memberName}</strong>,</p>
            
            <p>Thank you for your interest in joining the Adamjee Cantonment College IT Club (ACCITC).</p>
            
            <p>We regret to inform you that your application was not successful at this time. This decision was made after careful consideration of all applications.</p>
            
            <p>We encourage you to continue developing your skills and consider applying again in the future. There are many ways to get involved in technology and programming, and we wish you the best in your journey.</p>
            
            <p>If you have any questions about this decision, please feel free to reply to this email.</p>
        </div>
        
        <div class="signature">
            <p>Best regards,<br>
            <strong>ACCITC Executive Members</strong></p>
        </div>
        
        <div class="footer">
            <p>Adamjee Cantonment College IT Club<br>
            <a href="mailto:itclub@acc.edu.bd">itclub@acc.edu.bd</a></p>
        </div>
    </div>
</body>
</html>`;

  const text = `
Application Update - ACCITC

Hi ${memberName},

Thank you for your interest in joining the Adamjee Cantonment College IT Club (ACCITC).

We regret to inform you that your application was not successful at this time. This decision was made after careful consideration of all applications.

We encourage you to continue developing your skills and consider applying again in the future. There are many ways to get involved in technology and programming, and we wish you the best in your journey.

If you have any questions about this decision, please feel free to reply to this email.

Best regards,
ACCITC Executive Members

---
Adamjee Cantonment College IT Club
itclub@acc.edu.bd
`;

  return { html, text };
}