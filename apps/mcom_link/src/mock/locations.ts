// Mock Location Data
// Each location represents a physical storefront with a QR/NFC trigger point

export interface Location {
    id: string
    name: string
    campaignName: string
    address: string
    isActive: boolean
}

export const mockLocations: Location[] = [
    {
        id: 'high-street-001',
        name: 'High Street Central',
        campaignName: 'Spring High Street Campaign',
        address: '12 High Street, London EC1A',
        isActive: true,
    },
    {
        id: 'market-square-002',
        name: 'Market Square',
        campaignName: 'Market Square Deals',
        address: '5 Market Square, London WC2',
        isActive: true,
    },
    {
        id: 'broadway-003',
        name: 'Broadway Corner',
        campaignName: 'Broadway Winter Warmers',
        address: '88 Broadway, London SW1',
        isActive: true,
    },
]

export function getLocationById(id: string): Location | undefined {
    return mockLocations.find((loc) => loc.id === id)
}
