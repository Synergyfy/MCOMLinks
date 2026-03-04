// Mock Business Data
// PRD STEP 2 & 9

export interface BusinessProfile {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    location: string;
    planType: 'Basic' | 'Premium';
    logoUrl?: string;
    agentName: string;
    agentEmail: string;
    joinedDate: string;
}

export const mockBusiness: BusinessProfile = {
    id: 'biz-001',
    name: "Bella's Boutique",
    contactPerson: "Isabella Rossi",
    email: "isabella@bellaboutique.com",
    phone: "+44 7700 900123",
    location: "High Street Central",
    planType: 'Premium',
    logoUrl: 'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=100&h=100&fit=crop',
    agentName: "James Thompson",
    agentEmail: "james@mcom.links",
    joinedDate: "2025-11-20"
};

export interface DashboardMetrics {
    totalScans: number;
    totalClaims: number;
    conversionRate: number;
    activeOffers: number;
    daysRemaining: number;
}

export const mockMetrics: DashboardMetrics = {
    totalScans: 1240,
    totalClaims: 186,
    conversionRate: 15.0,
    activeOffers: 1,
    daysRemaining: 12
};
