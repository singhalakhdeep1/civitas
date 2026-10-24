import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Civitas database...');

  await prisma.petition.create({
    data: {
      title: 'Clean Energy & Solar Transition for Public Schools',
      slug: 'clean-energy-solar-transition-public-schools',
      description: 'Petition to transition city public schools to 100% renewable solar energy by 2028.',
      target: 'GOVERNMENT',
      targetName: 'City School Board',
      signatureGoal: 5000,
      currentSignatures: 1240,
      status: 'ACTIVE',
      creatorId: 'seed-placeholder',
    },
  });

  console.log('Seeding complete for Civitas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
