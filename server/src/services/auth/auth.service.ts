import bcrypt from "bcrypt";
import jwtUtil from "../../utils/jwt.util";
import mailUtil from "../../utils/mail.util";
import optService from "../otp/opt.service";
import { passwordResetRequestEmailTemplate } from "../../templates/html/emailTemplates";
import prisma from "../../db/prisma/client/prisma.client";

class AuthService {
  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password.");
    if (user.provider === "GOOGLE") throw new Error("This account was created with Google. Please sign in with Google to continue.");
    if (!(await bcrypt.compare(password, user.password!))) throw new Error("Invalid email or password.");

    const accessToken = jwtUtil.generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = jwtUtil.generateRefreshToken({ id: user.id });

    // Store refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { user, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const decoded = jwtUtil.validateRefreshToken(refreshToken);
    if (!decoded) throw new Error("Invalid or expired refresh token.");

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== refreshToken) throw new Error("Invalid refresh token.");

    const newAccessToken = jwtUtil.generateAccessToken({ id: user.id, email: user.email });
    const newRefreshToken = jwtUtil.generateRefreshToken({ id: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logoutUser(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  forgotPassword = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found.");

    const expiryMinutes = 10;
    const otp = await optService.generateOtp(user.id, "password_reset", expiryMinutes);
    const { subject, html } = passwordResetRequestEmailTemplate(user, otp, expiryMinutes);

    await mailUtil.sendEmail(email, subject, html);
  };

  verifyPasswordResetOtp = async (email: string, otp: string): Promise<string> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const isVerified = await optService.verifyOtp(user.id, otp, "password_reset");

    if (!isVerified) {
      throw new Error("OTP verification failed.");
    }
    return "OTP verified successfully.";
  };

  resetPassword = async (email: string, newPassword: string): Promise<string> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const isPassworResetOtp = await optService.isOtpVerfied(user.id, "password_reset");

    if (!isPassworResetOtp) throw new Error("Please verify your password code to continue");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await optService.removeOtp(user.id, "password_reset");
    return "Password reset successful.";
  };
}

export default new AuthService();
