import { User } from "@prisma/client";

const passwordResetRequestEmailTemplate = (user: User, otp: string, expiryMinutes: number): { subject: string; html: string } => {
  const subject = `Lala Rentals | Password Reset Request`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #f5f5f5; padding: 20px 16px; text-align: center; color : #000">
        <h2 style="margin: 0; font-size: 24px;">Password Reset Request</h2>
      </div>
      <div style="padding: 24px; color: #000;">
        <p style="font-size: 16px;">Hello, ${user.firstName ?? ""}</p>
        <p style="font-size: 16px; line-height: 1.5;">
          You requested to reset your password for your Lala Rentals account. To complete the process, please use the following One-Time Password (OTP):
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; color: #FB524A; font-size: 28px; font-weight: bold; padding: 12px 24px;">${otp}</span>
        </div>
        <p style="font-size: 16px; line-height: 1.5;">
          This OTP will expire in <b>${expiryMinutes} minutes</b>.
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          If you did not request this password reset, please ignore this email or contact our support team immediately.
        </p>
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://google.com" style="background-color: #FB524A; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 4px;">Contact Support</a>
        </div>
      </div>
      <div style="background-color: #f5f5f5; padding: 16px; text-align: center; font-size: 14px; color: #888;">
        <p style="margin: 0;">If you have any questions, <a href="https://google.com" style="color: #FB524A; text-decoration: none;">Contact Us</a>.</p>
        <p style="margin: 8px 0 0;">&copy; ${new Date().getFullYear()} Lala Rentals. All rights reserved.</p>
      </div>
    </div>
  `;

  return { subject, html };
};

const accountRegistrationEmailTemplate = (otp: string, expiryMinutes: number): { subject: string; html: string } => {
  const subject = `Welcome to Lala Rentals | Account Registration Successful`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #f5f5f5; padding: 20px 16px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">Welcome to Lala Rentals!</h2>
      </div>
      <div style="padding: 24px; color: #000;">
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px; line-height: 1.5;">
          Thank you for choosing Lala Rentals! To complete your registration, please use the following One-Time Password (OTP):
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-
          block; color: #FB524A; font-size: 28px; font-weight: bold; padding: 12px 24px;">${otp}</span>
        </div>
        <p style="font-size: 16px; line-height: 1.5;">
          This OTP will expire in <b>${expiryMinutes}</b> minutes.
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          If you did not register for a Lala Rentals account, please ignore this email or contact our support team immediately.
        </p>
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://google.com" style="background-color: #FB524A; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 4px;">Contact Support</a>
        </div>
      </div>
      <div style="background-color: #f5f5f5; padding: 16px; text-align: center; font-size: 14px; color: #888;">
        <p style="margin: 0;">If you have any questions, <a href="https://google.com" style="color: #FB524A; text-decoration: none;">Contact Us</a>.</p>
        <p style="margin: 8px 0 0;">&copy; ${new Date().getFullYear()} Lala Rentals. All rights reserved.</p>
      </div>
    </div>
  `;
  return { subject, html };
};

export { passwordResetRequestEmailTemplate, accountRegistrationEmailTemplate };
