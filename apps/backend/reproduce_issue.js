const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to create location...');
        const result = await prisma.location.create({
            data: {
                slug: 'test-hub-' + Math.random().toString(36).substring(2, 10),
                name: 'Test Hub Manual',
                campaignName: 'Test Hub Manual',
                address: 'Test Address',
                city: 'London',
                postcode: 'W1F 0AA',
                scope: 'hyperlocal',
                rotatorConfig: {
                    create: {
                        type: 'sequential',
                        offerSequence: '[]',
                    }
                }
            },
            include: { rotatorConfig: true }
        });
        console.log('Success:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Prisma Error Details:');
        console.error(error);
        if (error.code) console.error('Error Code:', error.code);
        if (error.meta) console.error('Error Meta:', error.meta);
    } finally {
        await prisma.$disconnect();
    }
}

main();
