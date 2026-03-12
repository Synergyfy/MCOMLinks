
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testUpdate() {
    const locationId = '124c5e59-1cb8-4fb5-b34d-4a1e89252401';
    const configData = {
        type: "scarcity",
        fallbackBehavior: "default",
        customLink: null,
        offerSequence: "[\"efe232b4-ce83-4a4b-ba72-2dee29e9b52a\",\"1e9d65c2-c556-4523-b235-09e83d8780c7\"]",
        scarcityLimits: "{\"efe232b4-ce83-4a4b-ba72-2dee29e9b52a\":10}",
        weights: "{}"
    };

    console.log('--- Testing updateLocationRotator Logic ---');
    console.log('Input Scarcity Limits:', configData.scarcityLimits);

    const result = await prisma.rotatorConfig.update({
        where: { locationId },
        data: {
            type: configData.type,
            offerSequence: typeof configData.offerSequence === 'string'
                ? configData.offerSequence
                : JSON.stringify(configData.offerSequence || []),
            fallbackBehavior: configData.fallbackBehavior,
            customLink: configData.customLink,
            weights: typeof configData.weights === 'string'
                ? configData.weights
                : JSON.stringify(configData.weights || {}),
            scarcityLimits: typeof configData.scarcityLimits === 'string'
                ? configData.scarcityLimits
                : JSON.stringify(configData.scarcityLimits || {}),
        }
    });

    console.log('\nResult Scarcity Limits:', result.scarcityLimits);
    console.log('Result Weights:', result.weights);
    
    await prisma.$disconnect();
}

testUpdate();
