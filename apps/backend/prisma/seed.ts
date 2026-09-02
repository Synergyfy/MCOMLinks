import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/auth/password.util';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting to seed the database...');

    const seededPassword = await hashPassword('password123');

    // 1. Create demo users (email/password login is ADMIN-only; other roles
    // must authenticate via Central Hub Solution SSO, so only admin is seeded).
    const demoAdmin = await prisma.user.upsert({
        where: { email: 'admin@mcomlinks.com' },
        update: {},
        create: {
            email: 'admin@mcomlinks.com',
            password: seededPassword,
            name: 'Demo Admin',
            role: 'ADMIN',
        },
    });

    console.log(`Created/Updated admin user: ${demoAdmin.email}`);

    // 1b. Seed the plan catalogue (upsert by name so the seed can be re-run).
    // Mirrors the MCOM Links plan tiers and the MCOM Solutions plan contract.
    const seedPlans = [
        {
            name: 'Hyper-local',
            description: 'The free base tier to get your storefront on the rotator.',
            tagline: 'Start showing your business on MCOMQLinks',
            bestFor: 'Businesses just getting started, testing the platform, local storefront presence',
            monthlyPrice: 0,
            quarterlyPrice: 0,
            annualPrice: 0,
            isFree: true,
            features: ['1 Active Campaign', 'Postcode-Locked Exposure', 'Standard Support'],
            limitations: ['No promotion of third-party products/services', 'No automatic renewal (expires after 90 days)', 'No Expo access', 'Standard visibility only'],
            configuration: { quotas: { maxActiveCampaigns: 1, maxOffers: 5, maxLocations: 1 }, featureFlags: { priorityBoost: false, advancedAnalytics: false, customBranding: false, allowThirdPartyPromotion: false, allowAutoRollover: false, allowExpoAccess: false } },
            isActive: true,
            isDefault: true,
            type: 'STANDARD',
        },
        {
            name: 'Nearby Expansion',
            description: 'B2B outreach and cross-high-street partnerships.',
            tagline: 'Grow beyond your storefront and scale your campaigns',
            bestFor: 'Businesses ready to scale, multi-product/service sellers, partner/collaboration businesses',
            monthlyPrice: 29.99,
            quarterlyPrice: 79.99,
            annualPrice: 299.99,
            isFree: false,
            features: ['Expansion Radius Add-ons', 'Multiple Nearby Districts', 'B2B Partnerships', 'Growth Support'],
            limitations: ['No Expo access', 'Standard visibility only'],
            configuration: { quotas: { maxActiveCampaigns: 5, maxOffers: 20, maxLocations: 5, allowNearbyExpansion: true }, featureFlags: { priorityBoost: true, advancedAnalytics: true, customBranding: true, allowThirdPartyPromotion: true, allowAutoRollover: true, allowExpoAccess: false } },
            isActive: true,
            isDefault: false,
            type: 'STANDARD',
        },
        {
            name: 'National Network',
            description: 'Platform-wide fallback campaigns and corporate branding.',
            tagline: 'Maximum exposure, priority access, and event promotion',
            bestFor: 'Serious businesses, brands launching products/services, businesses that want maximum visibility',
            monthlyPrice: 99.99,
            quarterlyPrice: 269.99,
            annualPrice: 999.99,
            isFree: false,
            features: ['CPM or Fixed Slot Access', 'Premium Override Rights', 'Platform-Wide Exposure', 'Platinum Concierge'],
            limitations: [],
            configuration: { quotas: { maxActiveCampaigns: 20, maxOffers: 100, maxLocations: 50, allowNearbyExpansion: true, allowNationalNetwork: true }, featureFlags: { priorityBoost: true, advancedAnalytics: true, customBranding: true, allowThirdPartyPromotion: true, allowAutoRollover: true, allowExpoAccess: true } },
            isActive: true,
            isDefault: false,
            type: 'STANDARD',
        },
        {
            name: 'National Trial',
            description: 'A 14-day trial of the National Network.',
            tagline: 'Full National Network access for 14 days free',
            bestFor: 'New businesses wanting to try the platform risk-free',
            monthlyPrice: 0,
            quarterlyPrice: 0,
            annualPrice: 0,
            isFree: true,
            features: ['Full National Access', 'Priority Override', '14 Days Free'],
            limitations: ['Limited to 14 days', 'No auto rollover'],
            configuration: { quotas: { maxActiveCampaigns: 3, maxOffers: 10, maxLocations: 3, allowNearbyExpansion: true, allowNationalNetwork: true }, featureFlags: { priorityBoost: true, advancedAnalytics: true, customBranding: true, allowThirdPartyPromotion: true, allowAutoRollover: false, allowExpoAccess: true } },
            isActive: true,
            isDefault: false,
            type: 'TRIAL',
            trialDuration: 14,
        },
    ] as any[];

    for (const plan of seedPlans) {
        const existing = await prisma.plan.findFirst({ where: { name: plan.name } });
        const data = {
            name: plan.name,
            description: plan.description,
            tagline: plan.tagline ?? null,
            bestFor: plan.bestFor ?? null,
            isFree: plan.isFree ?? false,
            monthlyPrice: plan.isFree ? 0 : plan.monthlyPrice,
            quarterlyPrice: plan.isFree ? 0 : plan.quarterlyPrice,
            annualPrice: plan.isFree ? 0 : plan.annualPrice,
            features: JSON.stringify(plan.features),
            limitations: JSON.stringify(plan.limitations ?? []),
            configuration: JSON.stringify(plan.configuration),
            isActive: plan.isActive,
            isDefault: plan.isDefault,
            type: plan.type,
            trialDuration: plan.trialDuration ?? null,
        };
        if (existing) {
            await prisma.plan.update({ where: { id: existing.id }, data });
        } else {
            await prisma.plan.create({ data });
        }
    }

    // Ensure only one default plan after (re)seeding.
    const firstDefault = await prisma.plan.findFirst({ where: { isDefault: true } });
    if (firstDefault) {
        await prisma.plan.updateMany({
            where: { isDefault: true, id: { not: firstDefault.id } },
            data: { isDefault: false },
        });
    }

    console.log(`Seeded ${seedPlans.length} plans.`);

    // 2. Clear old data
    await prisma.rotatorConfig.deleteMany();
    await prisma.location.deleteMany();
    await prisma.businessProfile.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.offer.deleteMany();
    await prisma.supportMessage.deleteMany();

    // 2. Create multiple offers for rotation
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

    // 3. Create a demo location and its rotator config
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

    // 4. Create some initial activities
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
