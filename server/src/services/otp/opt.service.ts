import bcrypt from "bcrypt";
import prisma from "../../db/prisma/client/prisma.client";
import otpUtil from "../../utils/otp.util";
import { OTPPurpose } from "@prisma/client";

class OtpService {
  public generateOtp = async (userId: string, purpose: OTPPurpose, expiryMinutes: number = 10): Promise<string> => {
    // Delete any existing OTPs for the same user and purpose
    await prisma.otp.deleteMany({
      where: {
        userId,
        purpose,
      },
    });

    const otp = otpUtil.generateOtp();

    // Hash the OTP for secure storage
    const hashedOtp = await bcrypt.hash(otp, 10);

    const expiryDate = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Store OTP in the database
    await prisma.otp.create({
      data: {
        userId,
        purpose,
        otp: hashedOtp,
        expiresAt: expiryDate,
      },
    });

    return otp;
  };

  public verifyOtp = async (userId: string, otp: string, purpose: OTPPurpose): Promise<boolean> => {
    // Fetch the OTP record for the user and purpose
    const storedOtp = await prisma.otp.findFirst({
      where: {
        userId,
        purpose,
      },
    });

    if (!storedOtp) {
      throw new Error("No OTP found for this user.");
    }

    if (storedOtp.expiresAt < new Date()) {
      throw new Error("Verification code has expired request a new one to continue.");
    }

    const isMatch = await bcrypt.compare(otp, storedOtp.otp);

    if (!isMatch) {
      throw new Error("Incorrect verification code.");
    }

    await prisma.otp.update({ where: { id: storedOtp.id }, data: { verified: true } });
    return true;
  };

  public isOtpVerfied = async (userId: string, purpose: OTPPurpose): Promise<boolean> => {
    const storedOtp = await prisma.otp.findFirst({
      where: {
        userId,
        purpose,
      },
    });

    if (!storedOtp) {
      throw new Error("No OTP found for this user.");
    }

    return storedOtp.verified;
  };

  public removeOtp = async (userId: string, purpose: OTPPurpose): Promise<void> => {
    const storedOtp = await prisma.otp.findFirst({
      where: {
        userId,
        purpose,
      },
    });

    if (!storedOtp) {
      throw new Error("No OTP found for this user.");
    }

    await prisma.otp.delete({
      where: { id: storedOtp.id },
    });
  };
}

export default new OtpService();
