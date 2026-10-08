import prisma from "../../config/prisma.js";

export const AppointmentService = {
  bookAppointment: async (studentId: string, scheduleId: string) => {
    return await prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.findUnique({ where: { id: scheduleId } });
      if (!schedule || schedule.isBooked || schedule.deletedAt) {
        throw new Error("Schedule slot is already booked or unavailable");
      }

      await tx.schedule.update({
        where: { id: scheduleId },
        data: { isBooked: true },
      });

      const appointment = await tx.appointment.create({
        data: {
          studentId,
          scheduleId,
          instructorId: schedule.instructorId,
          status: "PENDING",
        },
        include: { schedule: true, instructor: { select: { name: true, email: true } } },
      });

      return appointment;
    });
  },

  getMyAppointments: async (userId: string, role: string) => {
    const where: any = role === "STUDENT" ? { studentId: userId } : { instructorId: userId };
    where.deletedAt = null;

    return await prisma.appointment.findMany({
      where,
      include: { schedule: true, student: { select: { name: true, email: true } }, instructor: { select: { name: true, email: true } }, payment: true },
      orderBy: { createdAt: "desc" },
    });
  },

  updateAppointmentStatus: async (appointmentId: string, status: any) => {
    return await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
  },

  getInvoice: async (appointmentId: string, userId: string) => {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { student: true, schedule: true, payment: true },
    });

    if (!appointment || appointment.studentId !== userId) {
      throw new Error("Appointment not found or unauthorized");
    }

    return appointment;
  },
};