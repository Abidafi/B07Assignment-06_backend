import cron from "node-cron";
import prisma from "../config/prisma.js";

export const setupCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running Cron Job: Deleting unverified accounts older than 24 hours...");
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const result = await prisma.user.deleteMany({
        where: {
          isVerified: false,
          createdAt: { lt: twentyFourHoursAgo },
        },
      });

      console.log(`Cron Job Success: Removed ${result.count} unverified users.`);
    } catch (error) {
      console.error("Cron Job Error:", error);
    }
  });
};