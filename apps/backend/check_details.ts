
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDetails() {
    const now = new Date();
    console.log('Current Time:', now.toISOString());

    const offers = await prisma.offer.findMany({
        where: { status: 'approved' }
    });

    console.log(`\nApproved Offers (${offers.length}):`);
    offers.forEach(o => {
        const isStarted = o.startDate <= now;
        const isNotEnded = o.endDate >= now;
        const isValid = isStarted && isNotEnded;
        console.log(`- [${isValid ? 'VALID' : 'INVALID'}] ${o.headline}`);
        console.log(`  Start: ${o.startDate.toISOString()}, End: ${o.endDate.toISOString()}`);
    });

    const configs = await prisma.rotatorConfig.findMany({
        include: { location: true }
    });

    console.log('\nRotator Configs:');
    configs.forEach(c => {
        console.log(`- Location: ${c.location.name} (${c.locationId})`);
        console.log(`  Pointer: ${c.pointer}, Sequence: ${c.offerSequence}`);
    });

    await prisma.$disconnect();
}

checkDetails();
