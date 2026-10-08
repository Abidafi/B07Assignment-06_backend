import prisma from "../../config/prisma.js";

export const EvaluationService = {
  createEvaluation: async (instructorId: string, payload: any) => {
    return await prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.findUnique({ where: { id: payload.appointmentId } });
      if (!appointment || appointment.instructorId !== instructorId) {
        throw new Error("Unauthorized or appointment not found");
      }

      const { listening, reading, writing, speaking } = payload;
      const rawAverage = (listening + reading + writing + speaking) / 4;
      const overallBand = Math.round(rawAverage * 2) / 2;

      const evaluation = await tx.evaluation.create({
        data: {
          appointmentId: payload.appointmentId,
          instructorId,
          listening,
          reading,
          writing,
          speaking,
          overallBand,
          feedback: payload.feedback,
        },
      });

      await tx.appointment.update({
        where: { id: payload.appointmentId },
        data: { status: "COMPLETED" },
      });

      return evaluation;
    });
  },

  getEvaluationById: async (id: string) => {
    return await prisma.evaluation.findUnique({
      where: { id },
      include: { appointment: { include: { student: { select: { name: true, email: true } } } } },
    });
  },
};