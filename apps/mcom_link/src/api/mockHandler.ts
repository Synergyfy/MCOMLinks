import { mockLocations } from '../mock/locations';
import { mockOffers } from '../mock/offers';
import { mockBusiness, mockMetrics } from '../mock/business';
import { mockSeasons, systemLogs } from '../mock/admin';
import { mockPlans } from '../mock/plans';

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
        handler: (_params, _body, query = {}) => {
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

    // --- ADMIN MERCHANTS (list) ---
    {
        pattern: '/admin/merchants',
        method: 'GET',
        handler: () => ([
            { id: 'm-001', name: "Bella's Boutique", contactEmail: 'hello@bellas.com', plan: 'Hyper-local', subscriptionStatus: 'active', user: { email: 'business@mcomlinks.com', name: 'Isabella' } },
            { id: 'm-002', name: 'Fashion Hub', contactEmail: 'hello@fashionhub.com', plan: 'Nearby', subscriptionStatus: 'suspended', user: { email: 'fashion@mcomlinks.com', name: 'Fashion Hub' } },
            { id: 'm-003', name: 'Tech World', contactEmail: 'hello@techworld.com', plan: 'National', subscriptionStatus: 'active', user: { email: 'tech@mcomlinks.com', name: 'Tech World' } },
        ]),
    },
    {
        pattern: '/admin/merchants/:id/plan',
        method: 'PATCH',
        handler: (params, body) => ({
            id: params.id,
            plan: body?.plan || 'Basic',
            updatedAt: new Date().toISOString(),
        }),
    },

    // --- ADMIN SEASONS (list) ---
    {
        pattern: '/admin/seasons',
        method: 'GET',
        handler: () => mockSeasons,
    },

    // --- ADMIN IDENTITY ---
    {
        pattern: '/admin/identity',
        method: 'GET',
        handler: () => ({
            brandColor: '#0a0a0a',
            headerText: 'Supporting Local Business',
            footerText: 'Powered by MCOMLinks System',
            showSocials: true,
        }),
    },

    // --- ADMIN HEALTH ---
    {
        pattern: '/admin/health/logs',
        method: 'GET',
        handler: () => systemLogs,
    },
    {
        pattern: '/admin/health/audit',
        method: 'GET',
        handler: () => systemLogs,
    },
    {
        pattern: '/admin/health/status',
        method: 'GET',
        handler: () => ([
            { id: 'redis', label: 'Redis Pointers', value: 'CONNECTED', status: 'optimal' },
            { id: 'sync', label: 'Sync Latency', value: '12ms', status: 'optimal' },
            { id: 'backup', label: 'Data Backups', value: 'SECURE', status: 'optimal' },
        ]),
    },

    // --- ADMIN OFFER BILLING ---
    {
        pattern: '/admin/offers/:id/billing',
        method: 'PATCH',
        handler: (params, body) => ({
            success: true,
            offerId: params.id,
            subscriptionStatus: body?.status || 'suspended',
        }),
    },

    // --- MCOM ECOSYSTEM: PLANS & PURCHASE ---
    {
        pattern: '/api/v1/plans',
        method: 'GET',
        handler: () => mockPlans,
    },
    {
        pattern: '/api/v1/mcom/packages/purchase/initiate',
        method: 'POST',
        handler: (_params, body) => {
            const plan = mockPlans.find(p => p.id === body?.externalPlanId) || mockPlans[0];
            return {
                clientSecret: 'pi_mock_secret_' + Date.now(),
                type: 'payment',
                plan,
            };
        },
    },
    {
        pattern: '/api/v1/mcom/packages/purchase/confirm',
        method: 'POST',
        handler: (_params, body) => {
            const plan = mockPlans.find(p => p.id === body?.externalPlanId) || mockPlans[0];
            return {
                success: true,
                package: {
                    id: 'pkg-' + Date.now(),
                    planId: plan.id,
                    planName: plan.name,
                    billingCycle: body?.billingCycle || 'monthly',
                    status: 'active',
                    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
                },
            };
        },
    },

    // --- AGENT PLATFORM ---
    {
        pattern: '/agent/dashboard/stats',
        method: 'GET',
        handler: () => ({
            newBusinesses: 12,
            newBusinessesGoal: 15,
            activeOffers: 34,
            activeOffersGoal: 40,
            portfolioScans: 4520,
            conversion: 8.4,
        }),
    },
    {
        pattern: '/agent/dashboard/urgent-actions',
        method: 'GET',
        handler: () => ([
            { id: 'a1', type: 'approval', message: 'Fashion Hub submitted a new offer for review', businessId: 'b-002' },
            { id: 'a2', type: 'expiry', message: "Tech World's National plan expires in 3 days", businessId: 'b-003' },
        ]),
    },
    {
        pattern: '/agent/dashboard/leaderboard',
        method: 'GET',
        handler: () => ([
            { id: 'b-001', name: "Bella's Boutique", scans: 2100, claims: 320, conversion: 15.2 },
            { id: 'b-002', name: 'Fashion Hub', scans: 1450, claims: 210, conversion: 14.5 },
            { id: 'b-003', name: 'Tech World', scans: 970, claims: 120, conversion: 12.4 },
        ]),
    },
    {
        pattern: '/agent/portfolio',
        method: 'GET',
        handler: () => ({
            portfolio: [
                { id: 'b-001', name: "Bella's Boutique", ownerName: 'Isabella', contactEmail: 'hello@bellas.com', contactPhone: '+44 20 7946 0123', plan: 'Hyper-local', subscriptionStatus: 'active', totalScans: 2100, totalClaims: 320, offers: [{ id: 'off-1', headline: 'Buy 1 Get 1 Free', status: 'approved', scans: 2100 }] },
                { id: 'b-002', name: 'Fashion Hub', ownerName: 'Fashion Hub', contactEmail: 'hello@fashionhub.com', contactPhone: '+44 20 7946 0101', plan: 'Nearby', subscriptionStatus: 'suspended', totalScans: 1450, totalClaims: 210, offers: [] },
                { id: 'b-003', name: 'Tech World', ownerName: 'Tech World', contactEmail: 'hello@techworld.com', contactPhone: '+44 20 7946 0202', plan: 'National', subscriptionStatus: 'active', totalScans: 970, totalClaims: 120, offers: [] },
            ],
            targets: { newBusinesses: 12, newBusinessesGoal: 15, activeOffers: 34, activeOffersGoal: 40 },
        }),
    },
    {
        pattern: '/agent/portfolio/:id',
        method: 'GET',
        handler: (params) => {
            const businesses: any[] = [
                { id: 'b-001', name: "Bella's Boutique", ownerName: 'Isabella', contactEmail: 'hello@bellas.com', contactPhone: '+44 20 7946 0123', plan: 'Hyper-local', subscriptionStatus: 'active', totalScans: 2100, totalClaims: 320 },
                { id: 'b-002', name: 'Fashion Hub', ownerName: 'Fashion Hub', contactEmail: 'hello@fashionhub.com', contactPhone: '+44 20 7946 0101', plan: 'Nearby', subscriptionStatus: 'suspended', totalScans: 1450, totalClaims: 210 },
            ];
            const business = businesses.find(b => b.id === params.id) || null;
            if (!business) throw new Error('404: Resource not found');
            return { business, performance: { totalScans: business.totalScans, totalClaims: business.totalClaims }, offers: [] };
        },
    },
    {
        pattern: '/agent/performance',
        method: 'GET',
        handler: () => ({
            period: '30d',
            totalScans: 4520,
            totalClaims: 650,
            conversionRate: '14.4%',
            newBusinesses: 12,
            activeOffers: 34,
            timeline: [],
            byBusiness: [
                { id: 'b-001', name: "Bella's Boutique", scans: 2100, claims: 320 },
                { id: 'b-002', name: 'Fashion Hub', scans: 1450, claims: 210 },
            ],
        }),
    },
    {
        pattern: '/agent/onboard/checklist',
        method: 'GET',
        handler: () => ({
            steps: [
                { step: 1, label: 'Business Details', description: 'Collect business name, address, and contact info' },
                { step: 2, label: 'Owner Account', description: 'Create login credentials for the business owner' },
                { step: 3, label: 'Plan Selection', description: 'Choose Basic or Premium subscription plan' },
                { step: 4, label: 'First Offer', description: 'Draft the first offer for admin approval' },
                { step: 5, label: 'Go Live', description: 'Offer approved and business enters the rotator' },
            ],
        }),
    },
    {
        pattern: '/agent/onboard',
        method: 'POST',
        handler: (_params, body) => ({
            message: 'Business successfully onboarded',
            business: {
                id: 'b-' + Date.now(),
                name: body?.name || 'New Business',
                email: body?.email || 'owner@example.com',
                plan: body?.plan || 'Basic',
                temporaryPassword: 'Temp-' + Date.now(),
            },
        }),
    },
    {
        pattern: '/agent/business/:id',
        method: 'GET',
        handler: (params) => {
            const businesses: any[] = [
                { id: 'b-001', name: "Bella's Boutique", ownerName: 'Isabella', contactEmail: 'hello@bellas.com', contactPhone: '+44 20 7946 0123', plan: 'Hyper-local', subscriptionStatus: 'active', totalScans: 2100, totalClaims: 320 },
                { id: 'b-002', name: 'Fashion Hub', ownerName: 'Fashion Hub', contactEmail: 'hello@fashionhub.com', contactPhone: '+44 20 7946 0101', plan: 'Nearby', subscriptionStatus: 'suspended', totalScans: 1450, totalClaims: 210 },
                { id: 'b-003', name: 'Tech World', ownerName: 'Tech World', contactEmail: 'hello@techworld.com', contactPhone: '+44 20 7946 0202', plan: 'National', subscriptionStatus: 'active', totalScans: 970, totalClaims: 120 },
            ];
            const business = businesses.find(b => b.id === params.id) || null;
            if (!business) throw new Error('404: Resource not found');
            return { business, performance: { totalScans: business.totalScans, totalClaims: business.totalClaims }, offers: [] };
        },
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
