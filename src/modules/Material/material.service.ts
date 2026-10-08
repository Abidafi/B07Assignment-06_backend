import prisma from "../../config/prisma.js";

export const PublicContentService = {
  getPublicInstructors: async (query: any) => {
    const { expertise } = query;
    const where: any = { role: "INSTRUCTOR", deletedAt: null };
    if (expertise) {
      where.bio = { contains: expertise, mode: "insensitive" };
    }

    return await prisma.user.findMany({
      where,
      select: { id: true, name: true, bio: true, targetBandScore: true, avatarUrl: true },
    });
  },

  searchMaterials: async (keyword: string) => {
    return await prisma.material.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
          { category: { contains: keyword, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  },
};