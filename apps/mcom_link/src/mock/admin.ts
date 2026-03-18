export interface AdminProfile {
    id: string;
    name: string;
    email: string;
    role: 'Super Admin' | 'Operations Admin' | 'Analytics Admin';
    avatar?: string;
}

export interface Season {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface StorefrontTemplate {
    brandColor: string;
    headerText: string;
    footerText: string;
    logoUrl: string;
    showSocials: boolean;
}

export const mockAdmins: AdminProfile[] = [
    {
        id: 'admin-001',
        name: 'Super Admin',
        email: 'super@mcomqlinks.com',
        role: 'Super Admin'
    },
    {
        id: 'admin-002',
        name: 'Ops Manager',
        email: 'ops@mcomqlinks.com',
        role: 'Operations Admin'
    }
];

export const mockSeasons: Season[] = [
    {
        id: 's-winter',
        name: 'Winter',
        startDate: '2025-11-01',
        endDate: '2026-02-28',
        isActive: false
    },
    {
        id: 's-spring',
        name: 'Spring',
        startDate: '2026-03-01',
        endDate: '2026-05-31',
        isActive: true
    },
    {
        id: 's-summer',
        name: 'Summer',
        startDate: '2026-06-01',
        endDate: '2026-08-31',
        isActive: false
    },
    {
        id: 's-autumn',
        name: 'Autumn',
        startDate: '2026-09-01',
        endDate: '2026-10-31',
        isActive: false
    }
];

export const mockTemplate: StorefrontTemplate = {
    brandColor: '#2563eb', // Standard MCOMQLINKS Blue
    headerText: 'Exclusive High Street Offers',
    footerText: 'Powered by MCOMQLINKS - Revitalizing Commerce',
    logoUrl: '/logo.png',
    showSocials: true
};

export const systemLogs = [
    { id: 1, type: 'info', message: 'Rotator reset at High Street Central', timestamp: new Date().toISOString() },
    { id: 2, type: 'warning', message: 'Low offer count in Mall North (2 active)', timestamp: new Date().toISOString() },
    { id: 3, type: 'error', message: 'Failed scan detected (Location: West End)', timestamp: new Date().toISOString() }
];
