import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// This endpoint is for testing email configuration only
// It should be protected or removed in production
export async function GET(request: NextRequest) {
  try {
    // Check for secret token to prevent unauthorized access
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // Replace with a strong secret value
    const expectedSecret = process.env.EMAIL_TEST_SECRET || 'TEST_SECRET_TOKEN';
    
    if (secret !== expectedSecret) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access',
      }, { status: 401 });
    }
    
    // Email configuration
    if (!process.env.EMAIL_HOST || 
        !process.env.EMAIL_PORT || 
        !process.env.EMAIL_USER || 
        !process.env.EMAIL_PASS || 
        !process.env.EMAIL_RECIPIENT) {
      return NextResponse.json({
        success: false,
        message: 'Missing email configuration variables',
        missingVars: [
          !process.env.EMAIL_HOST ? 'EMAIL_HOST' : null,
          !process.env.EMAIL_PORT ? 'EMAIL_PORT' : null,
          !process.env.EMAIL_USER ? 'EMAIL_USER' : null,
          !process.env.EMAIL_PASS ? 'EMAIL_PASS' : null,
          !process.env.EMAIL_RECIPIENT ? 'EMAIL_RECIPIENT' : null,
        ].filter(Boolean),
      }, { status: 500 });
    }
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Verify the connection
    await transporter.verify();
    
    // Send a test email
    const info = await transporter.sendMail({
      from: `"Email Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECIPIENT,
      subject: "Test Email from Portfolio Site",
      text: "This is a test email to verify your email configuration is working correctly.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>This is a test email to verify your email configuration is working correctly.</p>
          <p>If you're seeing this email, your configuration is set up properly!</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 14px;">
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
      previewURL: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 