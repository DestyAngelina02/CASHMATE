import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });

  const kasirRole = await prisma.role.upsert({
    where: { name: 'KASIR' },
    update: {},
    create: { name: 'KASIR' },
  });

  console.log('Roles seeded:', { adminRole, kasirRole });

  // 2. Create Admin User
  const adminEmail = 'admin@cashmate.com';
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      name: 'Administrator',
      email: adminEmail,
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  console.log('Admin user seeded:', {
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
  });

  // 3. Create initial Categories
  const categories = ['Makanan', 'Minuman', 'Kebutuhan Harian', 'Pakaian', 'Elektronik'];
  for (const catName of categories) {
    await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName },
    });
  }
  console.log('Default categories seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
