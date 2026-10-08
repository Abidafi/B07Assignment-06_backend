import prisma from "../../config/prisma.js";

export const AdminService = {
  getDashboardStats: async () => {
    const totalStudents = await prisma.user.count({ where: { role: "STUDENT", deletedAt: null } });
    const totalInstructors = await prisma.user.count({ where: { role: "INSTRUCTOR", deletedAt: null } });
    const totalAppointments = await prisma.appointment.count({ where: { deletedAt: null } });
    const completedTests = await prisma.appointment.count({ where: { status: "COMPLETED", deletedAt: null } });

    const revenueAggregation = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED" },
    });

    return {
      totalStudents,
      totalInstructors,
      totalAppointments,
      completedTests,
      totalRevenue: revenueAggregation._sum.amount || 0,
    };
  },

  getAllUsers: async (query: any) => {
    const { page = 1, limit = 10, role } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { deletedAt: null };
    if (role) where.role = role;

    const users = await prisma.user.findMany({
      where,
      skip,
      take: Number(limit),
      select: { id: true, name: true, email: true, role: true, isVerified: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.user.count({ where });
    return { meta: { page: Number(page), limit: Number(limit), total }, data: users };
  },

  updateUserRole: async (adminUserId: string, targetUserId: string, newRole: any, ipAddress?: string) => {
    return await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: targetUserId },
        data: { role: newRole },
        select: { id: true, name: true, email: true, role: true },
      });

      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: "UPDATE_USER_ROLE",
          details: `Changed role of user ${targetUserId} to ${newRole}`,
          ipAddress: ipAddress ?? null,
        },
      });

      return updatedUser;
    });
  },

  getAuditLogs: async () => {
    return await prisma.auditLog.findMany({
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  },
};