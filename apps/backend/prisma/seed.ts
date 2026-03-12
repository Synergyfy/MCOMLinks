import "dotenv/config";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting to seed the database...');

    // 1. Create demo users
    const demoAdmin = await prisma.user.upsert({
        where: { email: 'admin@mcomlinks.com' },
        update: {},
        create: {
            email: 'admin@mcomlinks.com',
            password: 'password123',
            name: 'Demo Admin',
            role: 'ADMIN',
        },
    });

    const demoAgent = await prisma.user.upsert({
        where: { email: 'agent@mcomlinks.com' },
        update: {},
        create: {
            email: 'agent@mcomlinks.com',
            password: 'password123',
            name: 'James Agent',
            role: 'AGENT',
        },
    });

    const demoBusiness = await prisma.user.upsert({
        where: { email: 'business@mcomlinks.com' },
        update: {},
        create: {
            email: 'business@mcomlinks.com',
            password: 'password123',
            name: 'Isabella ShopOwner',
            role: 'USER',
        },
    });

    console.log(`Created/Updated users: ${demoAdmin.email}, ${demoAgent.email}, ${demoBusiness.email}`);

    // 2. Clear old data
    await prisma.rotatorConfig.deleteMany();
    await prisma.location.deleteMany();
    await prisma.businessProfile.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.offer.deleteMany();
    await prisma.supportMessage.deleteMany();

    // 3. Create a business profile
    const profile = await prisma.businessProfile.create({
        data: {
            name: "Bella's Boutique",
            description: "A premium fashion outlet showcasing the season's latest trends.",
            contactEmail: "hello@bellas.com",
            contactPhone: "+44 20 7946 0123",
            address: "88 High Street, Richmond, London TW9 1ED",
            logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop",
            primaryColor: "#2563eb",
            secondaryColor: "#f1f5f9",
            userId: demoBusiness.id,
        },
    });

    // 4. Create multiple offers for rotation
    const offer1 = await prisma.offer.create({
        data: {
            businessName: "Bella's Boutique",
            headline: '☕ Buy 1 Get 1 Free on Any Latte',
            description: 'Start your morning right with our premium handcrafted lattes.',
            imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
            startDate: new Date(),
            endDate: new Date('2030-12-31T23:59:59Z'),
            ctaLabel: 'Save to Phone',
            ctaType: 'claim',
            leadDestination: 'https://example.com/claim',
            status: 'approved',
        },
    });

    const offer2 = await prisma.offer.create({
        data: {
            businessName: "Fashion Hub",
            headline: '👗 20% OFF Spring Collection',
            description: 'Exclusive discount for mall visitors. Valid this weekend only!',
            imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop',
            startDate: new Date(),
            endDate: new Date('2030-12-31T23:59:59Z'),
            ctaLabel: 'Get Discount',
            ctaType: 'redeem',
            redemptionCode: 'MALL20',
            status: 'approved',
        },
    });

    const offer3 = await prisma.offer.create({
        data: {
            businessName: "Tech World",
            headline: '📱 Free Screen Protector with Repairs',
            description: 'Visit us on the 2nd floor for expert gadget repairs while you wait.',
            imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=400&fit=crop',
            startDate: new Date(),
            endDate: new Date('2030-12-31T23:59:59Z'),
            ctaLabel: 'Visit Store',
            ctaType: 'redirect',
            leadDestination: 'https://techworld.com',
            status: 'approved',
        },
    });

    console.log(`Created 3 offers for rotation.`);

    // 5. Create a demo location and its rotator config
    const location = await prisma.location.create({
        data: {
            id: 'demo-mall',
            slug: 'demo-mall-central',
            name: 'Demo Mall Central Hub',
            campaignName: 'Full Rotation Campaign',
            address: 'Central Plaza, Shopping District',
            isActive: true,
            rotatorConfig: {
                create: {
                    type: 'sequential',
                    offerSequence: JSON.stringify([offer1.id, offer2.id, offer3.id]),
                }
            }
        }
    });
    console.log(`Created location: ${location.name} (id: ${location.id})`);

    // 6. Create some initial activities
    await prisma.activity.createMany({
        data: [
            {
                type: 'SCAN',
                description: 'Scan at Demo Mall',
                visitorId: 'User1',
                offerId: offer1.id,
                createdAt: new Date()
            }
        ]
    });

    // Bulk fake stats
    await prisma.activity.createMany({
        data: Array.from({ length: 1541 }).map(() => ({ type: 'SCAN', description: 'Anonymous Scan' })),
    });
    await prisma.activity.createMany({
        data: Array.from({ length: 522 }).map(() => ({ type: 'CLAIM', description: 'Anonymous Claim' })),
    });
    await prisma.activity.createMany({
        data: Array.from({ length: 311 }).map(() => ({ type: 'REDEMPTION', description: 'Anonymous Redemption' })),
    });

    console.log(`Created initial activity records for the dashboard.`);

    // 5. Create initial support messages (matching frontend mock)
    await prisma.supportMessage.createMany({
        data: [
            {
                sender: 'agent',
                text: "Hi Isabella! I noticed your Spring Collection offer is performing great. Would you like to try boosting it for next weekend?",
                time: "Yesterday, 2:30 PM",
                userId: demoBusiness.id,
            },
            {
                sender: 'user',
                text: "That sounds good James! How much would a 3-day boost cost?",
                time: "Yesterday, 4:15 PM",
                userId: demoBusiness.id,
            },
            {
                sender: 'agent',
                text: "For your plan, it's just £49 for a Friday-Sunday peak boost. I can set it up for you if you approve!",
                time: "Today, 9:05 AM",
                userId: demoBusiness.id,
            }
        ]
    });
    console.log(`Created initial support messages.`);

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
