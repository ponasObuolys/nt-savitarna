// Seed script for creating test users
// Run with: node scripts/seed.mjs

import "dotenv/config";
import bcrypt from "bcryptjs";
import { createRequire } from "module";

// Dynamic import for the generated Prisma client
const { PrismaClient } = await import("../src/generated/prisma/client.js");

const prisma = new PrismaClient();

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("Seeding database...\n");

  // Create admin user
  const adminPasswordHash = await hashPassword("admin123");
  const admin = await prisma.app_users.upsert({
    where: { email: "admin@1partner.lt" },
    update: {},
    create: {
      email: "admin@1partner.lt",
      password_hash: adminPasswordHash,
      role: "admin",
    },
  });
  console.log("Admin user created:", admin.email);

  // Create test client user
  const clientPasswordHash = await hashPassword("client123");
  const client = await prisma.app_users.upsert({
    where: { email: "test@klientas.lt" },
    update: {},
    create: {
      email: "test@klientas.lt",
      password_hash: clientPasswordHash,
      role: "client",
    },
  });
  console.log("Client user created:", client.email);

  // Check if test orders exist for the test client
  const existingOrders = await prisma.uzkl_ivertink1P.count({
    where: {
      contact_email: {
        equals: "test@klientas.lt",
        mode: "insensitive",
      },
    },
  });

  console.log(`Found ${existingOrders} existing orders for test client`);

  console.log("\n=== Test Credentials ===");
  console.log("Admin: admin@1partner.lt / admin123");
  console.log("Client: test@klientas.lt / client123");
  console.log("========================\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
