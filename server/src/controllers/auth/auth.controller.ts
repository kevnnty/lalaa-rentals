import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import authService from "../../services/auth/auth.service";

class AuthService {
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      // if (!email || !password) {
      //   return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email and password are required." });
      // }

      // const { user, token } = await authService.loginUser(email, password);
      return res.send("Hello world!!");
    } catch (error: any) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
    }
  };
}

export default new AuthService();
