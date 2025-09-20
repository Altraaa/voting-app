import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth";

async function main() {
  const adminPassword = await hashPassword("admin123");
  await prisma.user.upsert({
    where: { email: "admin@voting.com" },
    update: {},
    create: {
      email: "admin@voting.com",
      name: "Super Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });
}

main()
  .then(() => console.log("Admin created"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
