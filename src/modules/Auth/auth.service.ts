import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../../config/redis.js";

export const AuthService = {
  register: async (payload: any) => {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: payload.role || "STUDENT",
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return user;
  },

  login: async (payload: any) => {
    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(payload.password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1d" } as any
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" } as any
    );

    return { accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  },

  forgotPassword: async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${email}`, otp, "EX", 300); // 5 mins expiry
    console.log(`[OTP for ${email}]: ${otp}`); // In prod, send via nodemailer
    return { message: "OTP sent successfully" };
  },

  resetPassword: async (payload: any) => {
    const storedOtp = await redis.get(`otp:${payload.email}`);
    if (!storedOtp || storedOtp !== payload.otp) {
      throw new Error("Invalid or expired OTP");
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);
    await prisma.user.update({
      where: { email: payload.email },
      data: { password: hashedPassword },
    });

    await redis.del(`otp:${payload.email}`);
    return { message: "Password reset successful" };
  },

  refreshTokenService: async (incomingRefreshToken: string) => {
    try {
      const decoded = jwt.verify(
        incomingRefreshToken as string,
        process.env.JWT_REFRESH_SECRET as string
      ) as { userId: string; role: string };

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        throw new Error("User not found or session expired");
      }

      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "1d") as any }
      );

      return { accessToken };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  },
};