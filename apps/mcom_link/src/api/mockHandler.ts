import { mockLocations } from '../mock/locations';
import { mockOffers } from '../mock/offers';
import { mockBusiness, mockMetrics } from '../mock/business';
import { mockSeasons, systemLogs } from '../mock/admin';

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

function matchPath(pattern: string, path: string): RegExpMatchArray | null {
    const regexStr = pattern
        .replace(/\/:id(\/status)?/g, '/([^/]+)')
        .replace(/\/:offerId/g, '/([^/]+)')
        .replace(/\/:locationId/g, '/([^/]+)')
        .replace(/\?.*$/, '');
    return path.match(new RegExp(`^${regexStr}$`));
}

function extractParams(pattern: string, path: string): Record<string, string> {
    const parts = pattern.split('/');
    const pathParts = path.split('?')[0].split('/');
    const params: Record<string, string> = {};
    parts.forEach((part, i) => {
        if (part.startsWith(':')) {
            params[part.slice(1)] = pathParts[i] || '';
        }
    });
    return params;
}

function getQueryParams(url: string): Record<string, string> {
    const qIdx = url.indexOf('?');
    if (qIdx === -1) return {};
    return Object.fromEntries(new URLSearchParams(url.slice(qIdx)));
}

interface MockRoute {
    pattern: string;
    method: string;
    handler: (params: Record<string, string>, body?: any, query?: Record<string, string>) => any;
}

function offerToApi(offer: any): any {
    return {
        ...offer,
        scans: offer.performance?.scans || 0,
        claims: offer.performance?.claims || 0,
    };
}

const routes: MockRoute[] = [
    // --- AUTH ---
    {
        pattern: '/auth/login',
        method: 'POST',
        handler: (_params, body) => ({
            access_token: 'mock-jwt-token-' + Date.now(),
            user: {
                id: 'admin-001',
                email: body?.email || 'admin@mcomqlinks.com',
                name: 'Super Admin',
                role: 'ADMIN',
            },
        }),
    },
    {
        pattern: '/auth/register',
        method: 'POST',
        handler: (_params, body) => ({
            id: 'biz-new-' + Date.now(),
            email: body?.email || 'user@example.com',
            name: body?.name || 'New User',
            role: 'BUSINESS',
            message: 'Registration successful. Please check your email to verify.',
        }),
    },

    // --- ADMIN STATS & ALERTS ---
    {
        pattern: '/admin/stats',
        method: 'GET',
        handler: () => ({
            activeLocations: mockLocations.filter(l => l.isActive).length,
            totalLocations: mockLocations.length,
            activeBusinesses: 42,
            activeOffers: mockOffers.filter(o => o.isActive && o.status === 'approved').length,
            healthyVolume: 'Stable',
            dailyScans: 1240,
            totalScans: 28450,
            dailyClaims: 186,
            growthRate: '+12.5%',
            systemStatus: 'Operational',
            revenueEstimated: '£12,450.00',
        }),
    },
    {
        pattern: '/admin/alerts',
        method: 'GET',
        handler: () => systemLogs,
    },
    {
        pattern: '/admin/config',
        method: 'GET',
        handler: () => ({
            maintenanceMode: false,
            allowRegistration: true,
            defaultRotatorType: 'sequential',
            sessionTimeout: 3600,
        }),
    },
    {
        pattern: '/admin/engine/pause',
        method: 'POST',
        handler: () => ({ success: true, message: 'Engine paused successfully' }),
    },

    // --- ADMIN LOCATIONS ---
    {
        pattern: '/admin/locations',
        method: 'GET',
        handler: () => mockLocations.map(l => ({
            ...l,
            city: l.address.split(',')[0] || 'London',
            postcode: l.id === 'loc-001' ? 'SE15' : l.id === 'loc-002' ? 'SW9' : l.id === 'loc-004' ? 'B1' : 'M1',
            scope: l.id === 'loc-003' ? 'hyperlocal' : 'national',
            rotatorType: 'sequential',
        })),
    },
    {
        pattern: '/admin/locations',
        method: 'POST',
        handler: (_params, body) => ({
            id: 'loc-' + Date.now(),
            name: body?.name || 'New Location',
            city: body?.city || 'London',
            postcode: body?.postcode || '',
            scope: body?.scope || 'hyperlocal',
            isActive: true,
            rotatorType: body?.rotatorType || 'sequential',
            campaignName: 'New Campaign',
            address: `${body?.city || 'London'}, UK`,
        }),
    },
    {
        pattern: '/admin/locations/:id',
        method: 'GET',
        handler: (params) => {
            const loc = mockLocations.find(l => l.id === params.id);
            return loc || { id: params.id, name: `Hub ${params.id}`, isActive: true, address: 'London, UK', campaignName: 'Active Campaign' };
        },
    },
    {
        pattern: '/admin/locations/:id',
        method: 'PATCH',
        handler: (params, body) => ({
            id: params.id,
            name: body?.name || 'Updated Location',
            city: body?.city || 'London',
            postcode: body?.postcode || '',
            isActive: body?.isActive ?? true,
            scope: body?.scope || 'hyperlocal',
            rotatorType: body?.rotatorType || 'sequential',
            campaignName: 'Updated Campaign',
            address: 'London, UK',
        }),
    },
    {
        pattern: '/admin/locations/:id/rotator',
        method: 'PATCH',
        handler: (params, body) => ({
            locationId: params.id,
            type: body?.type || 'sequential',
            offerSequence: body?.offerSequence || [],
            fallbackBehavior: body?.fallbackBehavior || 'default',
            customLink: body?.customLink || '',
            weights: body?.weights || {},
            scarcityLimits: body?.scarcityLimits || {},
        }),
    },
    {
        pattern: '/admin/locations/:id/reset-pointer',
        method: 'POST',
        handler: (params) => ({
            success: true,
            message: `Pointer reset for location ${params.id}`,
        }),
    },

    // --- ADMIN OFFERS ---
    {
        pattern: '/admin/offers',
        method: 'GET',
        handler: (_params, _body, query) => {
            let filtered = [...mockOffers];
            if (query.status) {
                filtered = filtered.filter(o => o.status === query.status);
            }
            return filtered.map(offerToApi);
        },
    },
    {
        pattern: '/admin/offers',
        method: 'POST',
        handler: (_params, body) => ({
            ...offerToApi(body || {}),
            id: 'off-' + Date.now(),
            status: 'submitted',
            isActive: true,
            performance: { scans: 0, claims: 0 },
            createdAt: new Date().toISOString(),
        }),
    },
    {
        pattern: '/admin/offers/:id/status',
        method: 'PATCH',
        handler: (params, body) => ({
            id: params.id,
            status: body?.status || 'approved',
            rejectionReason: body?.rejectionReason || undefined,
            updatedAt: new Date().toISOString(),
        }),
    },
    {
        pattern: '/admin/offers/:id/duplicate',
        method: 'POST',
        handler: (params) => {
            const original = mockOffers.find(o => o.id === params.id);
            return original ? {
                ...offerToApi(original),
                id: 'off-' + Date.now(),
                headline: original.headline + ' (Copy)',
                status: 'draft',
                createdAt: new Date().toISOString(),
            } : { id: 'off-' + Date.now(), status: 'draft' };
        },
    },
    {
        pattern: '/admin/offers/:id',
        method: 'PATCH',
        handler: (params, body) => ({
            ...offerToApi(body || {}),
            id: params.id,
            updatedAt: new Date().toISOString(),
        }),
    },
    {
        pattern: '/admin/offers/:id',
        method: 'DELETE',
        handler: (params) => ({
            success: true,
            message: `Offer ${params.id} deleted`,
        }),
    },

    // --- ADMIN IDENTITY ---
    {
        pattern: '/admin/identity',
        method: 'PATCH',
        handler: () => ({
            success: true,
            message: 'Identity template updated globally',
        }),
    },

    // --- ADMIN MERCHANTS ---
    {
        pattern: '/admin/merchants/onboard',
        method: 'POST',
        handler: (_params, body) => ({
            id: 'merchant-' + Date.now(),
            businessName: body?.businessName || 'New Merchant',
            contactEmail: body?.contactEmail || 'merchant@example.com',
            contactPhone: body?.contactPhone || '',
            status: 'pending',
            createdAt: new Date().toISOString(),
        }),
    },
    {
        pattern: '/admin/merchants/:id/status',
        method: 'PATCH',
        handler: (params, body) => ({
            id: params.id,
            status: body?.status || 'approved',
            updatedAt: new Date().toISOString(),
        }),
    },

    // --- ADMIN SEASONS ---
    {
        pattern: '/admin/seasons',
        method: 'POST',
        handler: (_params, body) => ({
            id: 's-' + Date.now(),
            name: body?.name || 'New Season',
            startDate: body?.startDate || new Date().toISOString().slice(0, 10),
            endDate: body?.endDate || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
            isActive: body?.isActive || false,
        }),
    },
    {
        pattern: '/admin/seasons/:id',
        method: 'PATCH',
        handler: (params, body) => {
            const existing = mockSeasons.find(s => s.id === params.id);
            return {
                ...existing,
                ...(body || {}),
                id: params.id,
                updatedAt: new Date().toISOString(),
            };
        },
    },
    {
        pattern: '/admin/seasons/:id',
        method: 'DELETE',
        handler: (params) => ({
            success: true,
            message: `Season ${params.id} deleted`,
        }),
    },

    // --- DASHBOARD STATS ---
    {
        pattern: '/dashboard/stats',
        method: 'GET',
        handler: () => ({
            totalScans: mockMetrics.totalScans,
            totalClaims: mockMetrics.totalClaims,
            conversionRate: mockMetrics.conversionRate,
            activeOffers: mockMetrics.activeOffers,
            daysRemaining: mockMetrics.daysRemaining,
            totalEngagements: 28450,
            weeklyGrowth: '+8.3%',
            topOffer: mockOffers[0]?.headline || 'N/A',
            engagementGrowth: 12,
            liveOffer: mockOffers[0] || null,
            quickActions: [
                { label: 'Create New Offer', link: '/dashboard/offers', type: 'primary', icon: 'plus' },
                { label: 'View Performance', link: '/dashboard/analytics', type: 'ghost', icon: 'chart' },
                { label: 'Upgrade Plan', link: '/dashboard/billing', type: 'ghost', icon: 'settings' },
            ],
        }),
    },

    // --- DASHBOARD SETTINGS ---
    {
        pattern: '/dashboard/settings',
        method: 'GET',
        handler: () => ({
            name: mockBusiness.name,
            description: 'Leading boutique on the high street.',
            logoUrl: mockBusiness.logoUrl,
            contactEmail: mockBusiness.email,
            contactPhone: mockBusiness.phone,
            address: mockBusiness.location,
            primaryColor: '#2563eb',
            secondaryColor: '#f8fafc',
            ownerName: mockBusiness.contactPerson,
            plan: mockBusiness.planType,
            subscriptionStatus: 'active',
        }),
    },
    {
        pattern: '/dashboard/settings',
        method: 'PATCH',
        handler: (_params, body) => ({
            ...body,
            ownerName: mockBusiness.contactPerson,
            plan: mockBusiness.planType,
            updatedAt: new Date().toISOString(),
        }),
    },

    // --- DASHBOARD OFFERS ---
    {
        pattern: '/dashboard/offers',
        method: 'GET',
        handler: () => mockOffers.map(offerToApi),
    },
    {
        pattern: '/dashboard/offers',
        method: 'POST',
        handler: (_params, body) => ({
            ...offerToApi(body || {}),
            id: 'off-' + Date.now(),
            status: 'submitted',
            isActive: true,
            createdAt: new Date().toISOString(),
        }),
    },
    {
        pattern: '/dashboard/offers/:id/engagement',
        method: 'GET',
        handler: (params) => ({
            offerId: params.id,
            totalScans: Math.floor(Math.random() * 500),
            totalClaims: Math.floor(Math.random() * 50),
            activities: [
                { id: 'act-1', type: 'view', timestamp: new Date().toISOString(), interestScore: 'high' },
                { id: 'act-2', type: 'click', timestamp: new Date().toISOString(), interestScore: 'medium' },
                { id: 'act-3', type: 'claim', timestamp: new Date().toISOString(), interestScore: 'verified' },
            ],
        }),
    },

    // --- STOREFRONT (PUBLIC) ---
    {
        pattern: '/r/offer/:offerId',
        method: 'GET',
        handler: (params) => {
            const offer = mockOffers.find(o => o.id === params.offerId);
            return offer ? offerToApi(offer) : null;
        },
    },
    {
        pattern: '/r/:locationId/track/:offerId/:type',
        method: 'GET',
        handler: () => ({ success: true }),
    },
];

function findRoute(method: string, endpoint: string): MockRoute | null {
    const path = endpoint.split('?')[0];
    for (const route of routes) {
        if (route.method !== method) continue;
        const routePath = route.pattern.includes('?') ? route.pattern.split('?')[0] : route.pattern;
        const match = matchPath(routePath, path);
        if (match) return route;
    }
    return null;
}

export async function mockApiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const method = options.method || 'GET';
    let body: any = undefined;
    if (options.body && typeof options.body === 'string') {
        try { body = JSON.parse(options.body); } catch { body = options.body; }
    }

    const route = findRoute(method, endpoint);
    if (route) {
        const params = extractParams(route.pattern, endpoint);
        const query = getQueryParams(endpoint);
        await delay(150 + Math.random() * 200);
        const result = route.handler(params, body, query);
        if (result === null) {
            throw new Error('404: Resource not found');
        }
        return result as T;
    }

    console.warn(`[MockHandler] No mock route matched: ${method} ${endpoint}`);
    await delay(50);
    return {} as T;
}
