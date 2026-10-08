import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AuthService } from "./auth.service.js";
import { GoogleAuthService } from "./googleAuth.service.js";

export const AuthController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  }),
  login: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    // If using cookies for refresh token:
    if (result.refreshToken) {
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  }),
  googleLogin: catchAsync(async (req: Request, res: Response) => {
    const result = (await GoogleAuthService.googleLogin(req.body.token)) as any;

    if (result?.refreshToken) {
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Google login successful",
      data: result,
    });
  }),
  forgotPassword: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.forgotPassword(req.body.email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP sent to email",
      data: result,
    });
  }),
  resetPassword: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.resetPassword(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password reset successfully",
      data: result,
    });
  }),
  refreshToken: catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token is required" });
    }

    const result = await AuthService.refreshTokenService(refreshToken);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Access token generated successfully",
      data: result,
    });
  }),

  logout: catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logged out successfully",
      data: null,
    });
  }),
};
