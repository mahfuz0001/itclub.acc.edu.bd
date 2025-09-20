import { createEmailTransporter, EMAIL_CONFIG } from './config';
import { generateWelcomeEmailTemplate, generateRejectionEmailTemplate, WelcomeEmailData } from './templates';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const transporter = createEmailTransporter();
  
  const mailOptions = {
    from: EMAIL_CONFIG.from,
    replyTo: EMAIL_CONFIG.replyTo,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(to: string, data: WelcomeEmailData) {
  const { html, text } = generateWelcomeEmailTemplate(data);
  
  return sendEmail({
    to,
    subject: 'Welcome to the Club! You\'re officially in! - ACCITC',
    html,
    text,
  });
}

export async function sendRejectionEmail(to: string, memberName: string) {
  const { html, text } = generateRejectionEmailTemplate(memberName);
  
  return sendEmail({
    to,
    subject: 'Application Update - ACCITC',
    html,
    text,
  });
}

export * from './config';
export * from './templates';