
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOffers() {
    try {
        const offers = await prisma.offer.findMany({
            where: { status: 'approved' }
        });
        console.log(`Found ${offers.length} approved offers:`);
        offers.forEach(o => {
            console.log(`- ${o.headline} (ID: ${o.id})`);
        });

        const locations = await prisma.location.findMany({
            include: { rotatorConfig: true }
        });
        console.log('\nLocations:');
        locations.forEach(l => {
            console.log(`- ${l.name} (ID: ${l.id}, Active: ${l.isActive})`);
            console.log(`  Pointer: ${l.rotatorConfig?.pointer}, Sequence: ${l.rotatorConfig?.offerSequence}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkOffers();
