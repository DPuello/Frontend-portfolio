import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { RateLimiter } from 'limiter';

// Rate limiter: 5 requests per minute (adjust as needed)
const limiter = new RateLimiter({
  tokensPerInterval: 5,
  interval: 'minute',
  fireImmediately: true
});

// IP-based rate limiting storage
const ipLimiters = new Map<string, RateLimiter>();

// Get limiter for specific IP
const getIpLimiter = (ip: string): RateLimiter => {
  if (!ipLimiters.has(ip)) {
    // 3 requests per minute per IP
    ipLimiters.set(ip, new RateLimiter({
      tokensPerInterval: 3,
      interval: 'minute',
      fireImmediately: true
    }));
  }
  return ipLimiters.get(ip)!;
};

// Clean up old IP limiters (run this periodically)
const cleanupIpLimiters = () => {
  // Remove limiters older than 1 hour to prevent memory leaks
  const now = Date.now();
  // Use Array.from to convert to array for TypeScript compatibility
  Array.from(ipLimiters.entries()).forEach(([ip, limiter]) => {
    // @ts-ignore - accessing private property for cleanup
    if (now - limiter.lastUsed > 3600000) {
      ipLimiters.delete(ip);
    }
  });
};

// Run cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupIpLimiters, 3600000);
}

// Email configuration
const getEmailConfig = () => {
  // Check if all required environment variables are set
  const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_RECIPIENT'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    host: process.env.EMAIL_HOST!,
    port: parseInt(process.env.EMAIL_PORT!, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
    recipient: process.env.EMAIL_RECIPIENT!,
  };
};

// Email sending function
const sendEmail = async (name: string, email: string, message: string) => {
  try {
    const config = getEmailConfig();
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    // Email content
    const mailOptions = {
      from: `"Portfolio Contact" <${config.auth.user}>`,
      to: config.recipient,
      subject: `New Contact Form Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<h3>Message:</h3>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Validate input fields
const validateFields = (
  name?: string, 
  email?: string, 
  message?: string
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Please provide a valid email address';
  }
  
  if (!message || message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }
  
  return { 
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check global rate limit
    const globalRemaining = await limiter.removeTokens(1);
    if (globalRemaining < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please try again later.'
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '60'
          }
        }
      );
    }
    
    // Check IP-based rate limit
    const ipLimiter = getIpLimiter(ip);
    const ipRemaining = await ipLimiter.removeTokens(1);
    if (ipRemaining < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests from your IP. Please try again later.'
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '60'
          }
        }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { name, email, message } = body;
    
    // Validate input fields
    const validation = validateFields(name, email, message);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }
    
    // Send email
    const result = await sendEmail(name, email, message);
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
} 