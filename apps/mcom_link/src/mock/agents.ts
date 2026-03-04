// Mock Agent Data
// PRD STEP 2, 3, 10, 11

export interface CommLog {
    id: string;
    businessId: string;
    date: string;
    note: string;
    type: 'call' | 'meeting' | 'email';
}

export interface AgentPortfolio {
    agentId: string;
    businessIds: string[];
    targets: {
        newBusinesses: number;
        newBusinessesGoal: number;
        activeOffers: number;
        activeOffersGoal: number;
    };
}

export interface AgentProfile {
    id: string;
    name: string;
    email: string;
    role: 'Field Agent' | 'Senior Account Manager';
    avatarUrl?: string;
}

export const mockAgents: AgentProfile[] = [
    {
        id: 'agent-001',
        name: 'James Thompson',
        email: 'james@mcom.links',
        role: 'Field Agent',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    }
];

export const mockPortfolio: AgentPortfolio = {
    agentId: 'agent-001',
    businessIds: ['biz-001', 'biz-002', 'biz-003', 'biz-004', 'biz-005'],
    targets: {
        newBusinesses: 8,
        newBusinessesGoal: 10,
        activeOffers: 12,
        activeOffersGoal: 15
    }
};

export const mockCommLogs: CommLog[] = [
    {
        id: 'log-001',
        businessId: 'biz-001',
        date: '2026-03-03T10:00:00Z',
        note: 'Discussed spring collection boost with Isabella. She is considering the premium placement for next weekend.',
        type: 'call'
    },
    {
        id: 'log-002',
        businessId: 'biz-002',
        date: '2026-03-02T14:30:00Z',
        note: 'Site visit to The Daily Grind. Noticed QR code placement could be better. Moved it closer to the till.',
        type: 'meeting'
    }
];
