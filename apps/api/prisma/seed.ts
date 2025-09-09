import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main(){
  console.log('Starting seed...');
  
  // demo users
  const adult = await prisma.user.upsert({
    where: { email: 'creator@ayinel.local' },
    update: {},
    create: { 
      email: 'creator@ayinel.local', 
      username: 'creator1', 
      displayName: 'Creator One',
      role: 'CREATOR',
      isCreator: true
    }
  });
  console.log('Created creator user:', adult.username);

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@ayinel.local' },
    update: {},
    create: { 
      email: 'viewer@ayinel.local', 
      username: 'viewer1', 
      displayName: 'Viewer One'
    }
  });
  console.log('Created viewer user:', viewer.username);

  // studio
  const studio = await prisma.studio.upsert({
    where: { id: 'creator1-studio' },
    update: {},
    create: { 
      id: 'creator1-studio', 
      name: 'Creator One Studio', 
      description: 'Welcome to my Ayinel Studio! 🎬 Creating amazing content for everyone.',
      ownerId: adult.id, 
      isFamilyFriendly: true 
    }
  });
  console.log('Created studio:', studio.name);

  console.log('Seed complete!');
}

main()
  .then(() => console.log('✓ Database seeded successfully'))
  .catch(e => {
    console.error('✗ Error seeding database:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
