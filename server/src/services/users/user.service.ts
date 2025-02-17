import { Provider, User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../db/prisma/client/prisma.client";
import { accountRegistrationEmailTemplate } from "../../templates/html/emailTemplates";
import mailUtil from "../../utils/mail.util";
import optService from "../otp/opt.service";

class UserService {
  registerUser = async (userData: User) => {
    const { email, password } = userData;
    const passwordHash = await bcrypt.hash(password!, 10);

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) throw new Error("Email already in use");

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
      },
    });

    const expiryMinutes = 10;
    const otp = await optService.generateOtp(user.id, "account_verification", expiryMinutes);
    const { subject, html } = accountRegistrationEmailTemplate(otp, expiryMinutes);

    await mailUtil.sendEmail(email, subject, html);
    return user;
  };

  resendEmailVerificationCode = async (email: string) => {
    const user = await this.findUserByEmail(email);
    if (!user) throw new Error("User not found!");

    const expiryMinutes = 10;
    const otp = await optService.generateOtp(user.id, "account_verification", expiryMinutes);
    const { subject, html } = accountRegistrationEmailTemplate(otp, expiryMinutes);

    await mailUtil.sendEmail(email, subject, html);
    return user;
  };

  verifyEmail = async (email: string, otp: string): Promise<boolean> => {
    const user = await this.findUserByEmail(email);
    if (!user) throw new Error("User not found!");
    const isValid = await optService.verifyOtp(user.id, otp, "account_verification");
    if (!isValid) throw new Error("Invalid or expired OTP");

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await optService.removeOtp(user.id, "account_verification");
    return true;
  };

  findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  };

  findUserById = async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    });
  };

  updateUser = async (id: string, updatedData: User) => {
    const existingUser = await this.findUserById(id);
    if (!existingUser) throw new Error("User does not exist!");

    return prisma.user.update({
      where: { id },
      data: {
        ...updatedData,
      },
    });
  };

  deleteUser = async (id: string) => {
    return prisma.user.delete({
      where: { id },
    });
  };

  getAllUsers = async () => {
    return prisma.user.findMany();
  };

  async findOrCreateUser(profile: any, provider: Provider) {
    let user = await prisma.user.findUnique({
      where: { email: profile.emails[0].value },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.emails[0].value,
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          profilePicture: profile.photos[0]?.value || "",
          isVerified: true,
          provider: provider,
        },
      });
    }

    if (user && user.provider !== provider) {
      throw new Error("This account used email and password to register, please use your credentials to sign in!");
    }

    return user;
  }
}

export default new UserService();
