import "dotenv/config";
const { PrismaClient } = await import("../src/generated/prisma/client.js");

const prisma = new PrismaClient();

async function seed() {
  const valuators = [
    { code: 'VAL001', first_name: 'Jonas', last_name: 'Jonaitis', phone: '+370 612 34567', email: 'jonas@vertintojas.lt', is_active: true },
    { code: 'VAL002', first_name: 'Petras', last_name: 'Petraitis', phone: '+370 623 45678', email: 'petras@vertintojas.lt', is_active: true },
    { code: 'VAL003', first_name: 'Ona', last_name: 'Onaitė', phone: '+370 634 56789', email: 'ona@vertintojas.lt', is_active: true },
    { code: 'VAL004', first_name: 'Marija', last_name: 'Marijaitė', phone: '+370 645 67890', email: 'marija@vertintojas.lt', is_active: false },
  ];

  for (const v of valuators) {
    await prisma.app_valuators.upsert({
      where: { code: v.code },
      update: v,
      create: v,
    });
  }
  console.log('Created', valuators.length, 'valuators');
  
  const orders = await prisma.uzkl_ivertink1P.findMany({ take: 10, select: { id: true } });
  if (orders.length > 0) {
    for (let i = 0; i < Math.min(5, orders.length); i++) {
      await prisma.uzkl_ivertink1P.update({
        where: { id: orders[i].id },
        data: { priskirta: 'VAL001' }
      });
    }
    for (let i = 5; i < Math.min(8, orders.length); i++) {
      await prisma.uzkl_ivertink1P.update({
        where: { id: orders[i].id },
        data: { priskirta: 'VAL002' }
      });
    }
    console.log('Assigned orders to valuators');
  }
}

seed()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); });
