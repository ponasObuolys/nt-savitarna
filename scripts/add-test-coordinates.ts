import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function addTestCoordinates() {
  // Vilnius city center coordinates
  const lat = 54.6872;
  const lng = 25.2797;

  // Create WKB binary format for MySQL POINT
  // Format: 4 bytes SRID (0) + 1 byte order (1=LE) + 4 bytes type (1=Point) + 8 bytes X + 8 bytes Y
  const buffer = Buffer.alloc(25);
  buffer.writeUInt32LE(0, 0);      // SRID = 0
  buffer.writeUInt8(1, 4);         // Little-endian
  buffer.writeUInt32LE(1, 5);      // Point type = 1
  buffer.writeDoubleLE(lng, 9);    // X = longitude
  buffer.writeDoubleLE(lat, 17);   // Y = latitude

  // Update order #314 with test coordinates
  await prisma.$executeRaw`
    UPDATE uzkl_ivertink1P
    SET address_coordinates = ${buffer}
    WHERE id = 314
  `;

  console.log('Added test coordinates to order #314');
  console.log(`Coordinates: ${lat}, ${lng} (Vilnius center)`);

  // Verify it was set
  const result = await prisma.$queryRaw`
    SELECT id, ST_AsText(address_coordinates) as coords
    FROM uzkl_ivertink1P
    WHERE id = 314
  `;
  console.log('Verification:', result);
}

addTestCoordinates()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); });
