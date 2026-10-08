import prisma from "../../config/prisma.js";

export const ScheduleService = {
  createSchedule: async (instructorId: string, payload: any) => {
    return await prisma.schedule.create({
      data: {
        instructorId,
        date: payload.date,
        startTime: payload.startTime,
        endTime: payload.endTime,
      },
    });
  },

  getAllSchedules: async (query: any) => {
    const { date, status } = query;
    const where: any = { deletedAt: null };
    if (date) where.date = date;
    if (status === "available") where.isBooked = false;

    return await prisma.schedule.findMany({
      where,
      include: {
        instructor: {
          select: { name: true, bio: true, targetBandScore: true },
        },
      },
      orderBy: { date: "asc" },
    });
  },

  getInstructorTodaySchedule: async (instructorId: string) => {
    const today: string = new Date().toISOString().split("T")[0]!;
    return await prisma.schedule.findMany({
      where: { instructorId, date: today, deletedAt: null },
      include: {
        appointment: {
          include: { student: { select: { name: true, email: true } } },
        },
      },
    });
  },

  softDeleteSchedule: async (scheduleId: string, instructorId: string) => {
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
    });
    if (!schedule || schedule.instructorId !== instructorId) {
      throw new Error("Unauthorized or schedule not found");
    }

    return await prisma.schedule.update({
      where: { id: scheduleId },
      data: { deletedAt: new Date() },
    });
  },

  updateScheduleService: async (
    scheduleId: string,
    instructorId: string,
    payload: { startTime?: Date; endTime?: Date; status?: string },
  ) => {
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new Error("Schedule slot not found");
    }

    if (schedule.instructorId !== instructorId) {
      throw new Error("Unauthorized to update this schedule slot");
    }

    return await prisma.schedule.update({
      where: { id: scheduleId },
      data: payload as any,
    });
  },
};