import bcrypt from "bcrypt";
import prisma from "../../db/prisma/client/prisma.client";
import { passwordResetRequestEmailTemplate } from "../../templates/html/emailTemplates";
import jwtUtil from "../../utils/jwt.util";
import mailUtil from "../../utils/mail.util";
import optService from "../otp/opt.service";
import userService from "../users/user.service";

class AuthService {
  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password.");
    if (user.provider === "GOOGLE") throw new Error("This account was created with Google. Please sign in with Google to continue.");
    if (!(await bcrypt.compare(password, user.password!))) throw new Error("Invalid email or password.");

    const accessToken = jwtUtil.generateAccessToken(user);
    const refreshToken = jwtUtil.generateRefreshToken(user);

    await userService.updateUser(user.id, { refreshToken });

    return { user, accessToken, refreshToken };
  }

  async logoutUser(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = jwtUtil.validateRefreshToken(refreshToken);
      const user = await userService.findUserById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error("Invalid refresh token.");
      }

      const newAccessToken = jwtUtil.generateAccessToken(user);
      const newRefreshToken = jwtUtil.generateRefreshToken(user);

      await userService.updateUser(user.id, { refreshToken });

      return { newAccessToken, newRefreshToken };
    } catch (error: any) {
      throw new Error(error.message || "Failed to refresh access token.");
    }
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
