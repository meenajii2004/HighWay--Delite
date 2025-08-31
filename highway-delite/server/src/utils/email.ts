import nodemailer from 'nodemailer';

// For development, we'll use a stub email service
// In production, you would configure a real email provider like SendGrid, AWS SES, etc.

export const sendOTPEmail = async (email: string, otp: string, name: string): Promise<boolean> => {
  try {
    // In development, just log the OTP
    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 OTP for ${email}: ${otp}`);
      console.log(`👤 Name: ${name}`);
      return true;
    }

    // Production email configuration
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@highwaydelite.com',
      to: email,
      subject: 'Your OTP for Highway Delite',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Highway Delite</h2>
          <p>Hello ${name},</p>
          <p>Your OTP for verification is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
          </div>
          <p>This OTP will expire in ${process.env.OTP_EXP_MINUTES || 10} minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated message from Highway Delite. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};
