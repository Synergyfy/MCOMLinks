
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/r/demo-mall';

async function verifyRotation() {
    console.log('--- Starting Rotation Verification ---');
    
    // 1. Initial State
    const initialConfig = await prisma.rotatorConfig.findFirst({
        where: { locationId: 'demo-mall' }
    });
    console.log(`Initial Pointer: ${initialConfig?.pointer}`);

    // 2. Simulate 3 Scans
    for (let i = 1; i <= 3; i++) {
        console.log(`\nSimulating Scan #${i}...`);
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (response.ok) {
            console.log(`Received Offer: ${data.offer.headline} (ID: ${data.offer.id})`);
            
            const updatedConfig = await prisma.rotatorConfig.findFirst({
                where: { locationId: 'demo-mall' }
            });
            console.log(`New Pointer: ${updatedConfig?.pointer}`);
        } else {
            console.log('Request failed:', data);
        }
    }

    console.log('\n--- Verification Complete ---');
    await prisma.$disconnect();
}

verifyRotation();
