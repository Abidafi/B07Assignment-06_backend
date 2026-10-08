import prisma from "../../config/prisma.js";
import { cloudinary } from "../../config/cloudinary.js";

export const UserService = {
  getProfile: async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, bio: true, targetBandScore: true, avatarUrl: true, createdAt: true },
    });
  },

  updateProfile: async (userId: string, payload: any) => {
    return await prisma.user.update({
      where: { id: userId },
      data: payload,
      select: { id: true, name: true, bio: true, targetBandScore: true },
    });
  },

  updateAvatar: async (userId: string, file: Express.Multer.File) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    if (user.avatarPublicId) {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }

    return await prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: file.path,
        avatarPublicId: (file as any).filename,
      },
      select: { id: true, name: true, email: true, avatarUrl: true },
    });
  },
};