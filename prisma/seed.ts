import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

// Setup pg pool and adapter for Prisma 7
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin12345", 10);

  // 1. Seed Admin Account
  const admin = await prisma.user.upsert({
    where: { email: "admin@ieltsprep.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@ieltsprep.com",
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
      bio: "Platform Administrator",
    },
  });

  // 2. Seed Instructor Account
  const instructor = await prisma.user.upsert({
    where: { email: "instructor@ieltsprep.com" },
    update: {},
    create: {
      name: "John Doe (IELTS Expert)",
      email: "instructor@ieltsprep.com",
      password: hashedPassword,
      role: "INSTRUCTOR",
      isVerified: true,
      targetBandScore: 9.0,
      bio: "Certified IELTS Examiner with 10 years experience.",
    },
  });

  // 3. Seed Student Account
  const student = await prisma.user.upsert({
    where: { email: "student@ieltsprep.com" },
    update: {},
    create: {
      name: "Jane Smith",
      email: "student@ieltsprep.com",
      password: hashedPassword,
      role: "STUDENT",
      isVerified: true,
      targetBandScore: 7.5,
      bio: "Preparing for Academic IELTS.",
    },
  });

  console.log({ admin, instructor, student });
  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });