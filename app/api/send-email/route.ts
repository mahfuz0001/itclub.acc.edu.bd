import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail, sendRejectionEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, memberName, messengerGroupLink, instagramGroupLink } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Missing required field: type' },
        { status: 400 }
      );
    }

    // For test requests, we only need the type
    if (type === 'test') {
      // Handle test case in the switch statement
    } else if (!to || !memberName) {
      return NextResponse.json(
        { error: 'Missing required fields: to, memberName' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(to, {
          memberName,
          messengerGroupLink,
          instagramGroupLink,
        });
        break;
      
      case 'rejection':
        result = await sendRejectionEmail(to, memberName);
        break;
      
      case 'test':
        // For test requests, just check if SMTP is configured
        const { createEmailTransporter } = await import('@/lib/email/config');
        try {
          createEmailTransporter();
          return NextResponse.json({
            success: true,
            message: 'Email configuration is valid',
          });
        } catch (error: unknown) {
          throw error;
        }
      
      default:
        return NextResponse.json(
          { error: 'Invalid email type. Supported types: welcome, rejection, test' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to send email:', error);
    
    // Handle specific error cases
    if (errorMessage.includes('SMTP credentials')) {
      return NextResponse.json(
        { 
          error: 'Email service not configured. Please contact administrator.',
          details: 'SMTP credentials are missing or invalid'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}