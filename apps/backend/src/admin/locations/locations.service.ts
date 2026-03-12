import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LocationsService {
    constructor(private readonly prisma: PrismaService) { }

    async listLocations() {
        const locations = await this.prisma.location.findMany({
            include: { rotatorConfig: true },
        });

        // Add dynamic business count based on offers in rotator
        const locationsWithStats = await Promise.all(locations.map(async (loc: any) => {
            let businessCount = 0;
            if (loc.rotatorConfig?.offerSequence) {
                try {
                    const offerIds = JSON.parse(loc.rotatorConfig.offerSequence);
                    const uniqueBusinesses = await this.prisma.offer.findMany({
                        where: { id: { in: offerIds } },
                        distinct: ['businessName'],
                        select: { businessName: true }
                    });
                    businessCount = uniqueBusinesses.length;
                } catch (e) {
                    console.error(`Failed to parse offer sequence for location ${loc.id}`, e);
                }
            }
            return { ...loc, businessCount };
        }));

        return locationsWithStats;
    }

    async getLocation(id: string) {
        const location = await this.prisma.location.findUnique({
            where: { id },
            include: { rotatorConfig: true },
        });
        if (!location) throw new NotFoundException('Location not found');
        return location;
    }

    async createLocation(data: any) {
        try {
            const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 6);
            return await this.prisma.location.create({
                data: {
                    slug,
                    name: data.name,
                    campaignName: data.campaignName || data.name, // Use name as fallback for campaignName
                    address: data.address || '',
                    city: data.city,
                    postcode: data.postcode,
                    scope: data.scope || 'hyperlocal',
                    rotatorConfig: {
                        create: {
                            type: data.rotatorType || 'sequential',
                            offerSequence: data.offerSequence || '[]',
                        }
                    }
                },
                include: { rotatorConfig: true },
            });
        } catch (error) {
            console.error('Error creating location:', error);
            throw error;
        }
    }

    async updateLocation(id: string, data: any) {
        return this.prisma.location.update({
            where: { id },
            data: {
                name: data.name,
                campaignName: data.campaignName,
                address: data.address,
                city: data.city,
                postcode: data.postcode,
                scope: data.scope,
                isActive: data.isActive,
            },
            include: { rotatorConfig: true },
        });
    }

    async updateLocationRotator(locationId: string, configData: any) {
        try {
            require('fs').writeFileSync('c:/tmp/rotator_debug.json', JSON.stringify({ locationId, configData }, null, 2));
        } catch (e) {}
        return this.prisma.rotatorConfig.update({
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
    }

    async resetPointer(locationId: string) {
        const config = await this.prisma.rotatorConfig.findUnique({ where: { locationId } });
        if (!config) throw new NotFoundException('Rotator configuration not found');

        return this.prisma.rotatorConfig.update({
            where: { locationId },
            data: { pointer: 0 }
        });
    }

    async deleteLocation(id: string) {
        // Cascade delete handled by Prisma or manual?
        // Let's check schema. Prisma usually needs manual delete if not set up with onDelete: Cascade
        // RotatorConfig has locationId @unique.

        // Let's do a transaction to be safe if cascade isn't on
        return this.prisma.$transaction(async (tx: any) => {
            await tx.rotatorConfig.deleteMany({ where: { locationId: id } });
            return tx.location.delete({ where: { id } });
        });
    }
}
