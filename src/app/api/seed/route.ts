import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

// This endpoint is only for development - remove or protect in production
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    console.log("Seeding database...");

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

    // Count test orders
    const existingOrders = await prisma.uzkl_ivertink1P.count({
      where: {
        contact_email: "test@klientas.lt",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        admin: admin.email,
        client: client.email,
        testOrders: existingOrders,
        credentials: {
          admin: "admin@1partner.lt / admin123",
          client: "test@klientas.lt / client123",
        },
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
