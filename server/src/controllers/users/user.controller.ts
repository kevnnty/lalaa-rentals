import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "@prisma/client";
import userService from "../../services/users/user.service";
import { errorResponse, successResponse } from "../../utils/response.util";

class UserController {
  registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) return res.status(StatusCodes.BAD_REQUEST).json(errorResponse({ message: "Email and password are required." }));

      await userService.registerUser(req.body);
      return res.status(StatusCodes.CREATED).json(successResponse({ message: "Your account has been created, Verify your email to continue" }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  };

  resendEmailVerificationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      await userService.resendEmailVerificationCode(email);

      return res.status(StatusCodes.OK).json(successResponse({ message: "New email verification code sent to email." }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  };

  verifyEmail = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const isVerified = await userService.verifyEmail(email, otp);

      if (isVerified) {
        return res.status(StatusCodes.OK).json(successResponse({ message: "Email verified successfully." }));
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse({ message: "Invalid verification code." }));
      }
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  };

  getMyProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user: User = (req as any).user;
      if (!user) return res.status(StatusCodes.NOT_FOUND).json(errorResponse({ message: "User not found" }));

      const userData = await userService.findUserById(user.id);
      return res.status(StatusCodes.OK).json(successResponse({ message: "My profile retrieved", data: userData }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  };

  getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const user = await userService.findUserById(id);
      if (!user) return res.status(StatusCodes.NOT_FOUND).json(errorResponse({ message: "User not found." }));

      return res.status(StatusCodes.OK).json(successResponse({ message: "User profile retrieved!", data: user }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  };
  updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user: User = (req as any).user;
      const updatedUser = await userService.updateUser(user.id, req.body);
      if (!updatedUser) return res.status(StatusCodes.NOT_FOUND).json(errorResponse({ message: "User not found." }));

      return res.status(StatusCodes.OK).json(successResponse({ message: "Profile updated.", data: updatedUser }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  };

  deleteMyAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user: User = (req as any).user;
      if (!user) return res.status(StatusCodes.NOT_FOUND).json(errorResponse({ message: "User not found." }));

      await userService.deleteUser(user.id);
      return res.status(StatusCodes.NO_CONTENT).json(successResponse({ message: "Your account has been deleted." }));
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse({ message: error.message, error }));
    }
  };
}

export default new UserController();
