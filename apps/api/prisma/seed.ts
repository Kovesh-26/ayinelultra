import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main(){
  // demo users
  const adult = await prisma.user.upsert({
    where: { email: 'creator@ayinel.local' },
    update: {},
    create: { email: 'creator@ayinel.local', handle: 'creator1', displayName: 'Creator One' }
  });
  const minor = await prisma.user.upsert({
    where: { email: 'kid@ayinel.local' },
    update: {},
    create: { email: 'kid@ayinel.local', handle: 'kid1', displayName: 'Kid One', isMinor: true, kidSettings: { create: {} } }
  });

  // studio
  const studio = await prisma.studio.upsert({
    where: { handle: 'creator1-studio' },
    update: {},
    create: { handle: 'creator1-studio', name: 'Creator One Studio', ownerId: adult.id, isFamilyFriendly: true }
  });

  // media
  await prisma.media.createMany({ data: [
    { id: crypto.randomUUID(), kind: 'video', studioId: studio.id, title: 'Intro', contentRating: 'G', isKidSafe: true },
    { id: crypto.randomUUID(), kind: 'video', studioId: studio.id, title: 'Episode 1', contentRating: 'PG', isKidSafe: true },
    { id: crypto.randomUUID(), kind: 'audio', studioId: studio.id, title: 'Theme Song', contentRating: 'PG13', isKidSafe: true }
  ]});

  // memberships/products
  await prisma.membershipTier.create({ data: { studioId: studio.id, name: 'Member', priceCents: 499, perks: ['Ad‑free','Crew badge'] } });
  const prod = await prisma.product.create({ data: { studioId: studio.id, title: 'Creator Tee', priceCents: 2500 } });

  // order sample
  const addr = await prisma.address.create({ data: { userId: adult.id, line1: '123 Demo St', city: 'Mobile', postal: '36601', country: 'US' } });
  const order = await prisma.order.create({ data: { userId: adult.id, totalCents: 2500, addressId: addr.id, status: 'paid' } });
  await prisma.orderItem.create({ data: { orderId: order.id, productId: prod.id, qty: 1, unitCents: 2500 } });

  // flags
  await prisma.featureFlag.create({ data: { key: 'clips-editor', enabled: false, rollout: 0 } });
}

main().then(()=>console.log('Seed complete')).catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect());
