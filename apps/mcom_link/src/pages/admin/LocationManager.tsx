import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { api } from '../../api/apiClient'
import LoadingScreen from '../LoadingScreen'
import type { Offer } from '../../types'

type RotationType = 'sequential' | 'random' | 'scarcity' | 'split'
type FallbackBehavior = 'default' | 'link' | 'expired'

interface RotatorConfig {
    id?: string
    locationId: string
    type: RotationType
    offerSequence: string[]
    fallbackBehavior: FallbackBehavior
    customLink?: string
    weights: Record<string, number>
    scarcityLimits: Record<string, number>
}

export default function LocationManager() {
    // 1. All hooks must be at the very top, before ANY conditional returns or logic
    const [activeTab, setActiveTab] = useState<'national' | 'hyperlocal'>('national')
    const [locations, setLocations] = useState<any[]>([])
    const [allOffers, setAllOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isManageModalOpen, setIsManageModalOpen] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<any>(null)
    const [rotatorConfig, setRotatorConfig] = useState<RotatorConfig | null>(null)
    const [isQRModalOpen, setIsQRModalOpen] = useState(false)
    const [selectedQRLocation, setSelectedQRLocation] = useState<any>(null)
    const [offerSearchTerm, setOfferSearchTerm] = useState('')
    const [showAddOfferPanel, setShowAddOfferPanel] = useState(false)
    const [newLocation, setNewLocation] = useState({
        name: '',
        city: 'London',
        type: 'national' as 'national' | 'hyperlocal',
        postcode: ''
    })
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const ukCities = [
        'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow',
        'Liverpool', 'Newcastle', 'Sheffield', 'Bristol', 'Belfast',
        'Edinburgh', 'Cardiff', 'Nottingham', 'Southampton'
    ]

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [locs, offers] = await Promise.all([
                api.get<any[]>('/admin/locations'),
                api.get<Offer[]>('/admin/offers?status=approved')
            ])
            setLocations(Array.isArray(locs) ? locs : [])
            setAllOffers(Array.isArray(offers) ? offers : [])
        } catch (error) {
            console.error('Failed to fetch location data:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredLocations = locations.filter(loc => {
        const matchesSearch = (loc.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (loc.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (loc.postcode?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        const scope = activeTab === 'national' ? 'national' : 'hyperlocal'
        const matchesTab = (loc.scope || 'hyperlocal') === scope
        return matchesSearch && matchesTab
    })

    const toggleStatus = async (loc: any) => {
        try {
            const updated = await api.patch(`/admin/locations/${loc.id}`, {
                isActive: !loc.isActive
            })
            setLocations(locations.map(l => l.id === loc.id ? updated : l))
        } catch (error) {
            console.error('Failed to toggle status:', error)
        }
    }

    const resetPointer = async (id: string) => {
        try {
            await api.post(`/admin/locations/${id}/reset-pointer`, {})
            const updated = await api.get(`/admin/locations/${id}`)
            setLocations(locations.map(l => l.id === id ? updated : l))
        } catch (error) {
            console.error('Failed to reset pointer:', error)
        }
    }

    const handleAddLocation = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post('/admin/locations', {
                name: newLocation.name,
                city: newLocation.city,
                postcode: newLocation.postcode,
                scope: newLocation.type,
                rotatorType: 'sequential'
            })
            setIsAddModalOpen(false)
            setNewLocation({ name: '', city: 'London', type: 'national', postcode: '' })
            await fetchData()
        } catch (error) {
            console.error('Failed to create location:', error)
            alert('Failed to create location. Please check console for details.')
        }
    }

    const openManageModal = (loc: any) => {
        setSelectedLocation(loc)
        const config = loc.rotatorConfig
        if (config) {
            setRotatorConfig({
                ...config,
                offerSequence: typeof config.offerSequence === 'string'
                    ? JSON.parse(config.offerSequence)
                    : config.offerSequence || [],
                weights: config.weights ? (typeof config.weights === 'string' ? JSON.parse(config.weights) : config.weights) : {},
                scarcityLimits: config.scarcityLimits ? (typeof config.scarcityLimits === 'string' ? JSON.parse(config.scarcityLimits) : config.scarcityLimits) : {}
            })
        }
        setIsManageModalOpen(true)
    }

    const handleSaveConfig = async () => {
        if (rotatorConfig && selectedLocation) {
            try {
                await api.patch(`/admin/locations/${selectedLocation.id}/rotator`, {
                    type: rotatorConfig.type,
                    offerSequence: JSON.stringify(rotatorConfig.offerSequence),
                    fallbackBehavior: rotatorConfig.fallbackBehavior,
                    customLink: rotatorConfig.customLink,
                    weights: JSON.stringify(rotatorConfig.weights || {}),
                    scarcityLimits: JSON.stringify(rotatorConfig.scarcityLimits || {})
                })
                setIsManageModalOpen(false)
                fetchData()
            } catch (error) {
                console.error('Failed to save rotator config:', error)
            }
        }
    }

    const openQRModal = (loc: any) => {
        setSelectedQRLocation(loc)
        setIsQRModalOpen(true)
    }

    const downloadQR = async (loc: any) => {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(window.location.origin + '/r/' + loc.id)}`
        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const blobUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = `QR_${loc.id}_${loc.name.replace(/\s+/g, '_')}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)
        } catch (error) {
            console.error('Download failed', error)
            window.open(url, '_blank')
        }
    }

    const copyToClipboard = (text: string, id: string) => {
        const fullUrl = `${window.location.origin}${text}`
        navigator.clipboard.writeText(fullUrl).then(() => {
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        })
    }

    const updateConfig = (updates: Partial<RotatorConfig>) => {
        if (!rotatorConfig) return
        const newConfig = { ...rotatorConfig, ...updates }
        setRotatorConfig(newConfig)
    }

    const addOfferToRotator = (offerId: string) => {
        if (!rotatorConfig || rotatorConfig.offerSequence.includes(offerId)) return
        updateConfig({
            offerSequence: [...rotatorConfig.offerSequence, offerId]
        })
        setOfferSearchTerm('')
    }

    const addBusinessToRotator = (businessName: string) => {
        if (!rotatorConfig) return
        const businessOffers = allOffers.filter(o => o.businessName === businessName)
        const newIds = businessOffers.map(o => o.id).filter(id => !rotatorConfig.offerSequence.includes(id))
        if (newIds.length === 0) return
        updateConfig({
            offerSequence: [...rotatorConfig.offerSequence, ...newIds]
        })
    }

    const removeOfferFromRotator = (offerId: string) => {
        if (!rotatorConfig) return
        updateConfig({
            offerSequence: rotatorConfig.offerSequence.filter(id => id !== offerId)
        })
    }

    const moveOffer = (index: number, direction: 'up' | 'down') => {
        if (!rotatorConfig) return
        const sequence = [...rotatorConfig.offerSequence]
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= sequence.length) return
        [sequence[index], sequence[newIndex]] = [sequence[newIndex], sequence[index]]
        updateConfig({ offerSequence: sequence })
    }

    const getOrderedOffers = () => {
        if (!rotatorConfig) return []
        const sequence = rotatorConfig.offerSequence
        const items = sequence
            .map(id => allOffers.find(o => o.id === id))
            .filter((o): o is any => !!o)
        return items.sort((a, b) => {
            if (a.isPremium === b.isPremium) return 0
            return a.isPremium ? -1 : 1
        })
    }

    const handleTogglePremium = (id: string) => {
        setAllOffers(allOffers.map(o => o.id === id ? { ...o, isPremium: !o.isPremium } : o))
    }

    // 2. Wrap the JSX in a condition instead of returning early
    if (loading) {
        return <LoadingScreen />
    }

    return (
        <AdminLayout title="Network Management">
            {/* Same JSX as before */}
            <div className="db-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <h2 className="db-card-title">Discovery Network</h2>
                            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Management of high street clusters and local radius hubs.</p>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="db-input"
                                placeholder="Search hubs..."
                                style={{ paddingLeft: '2.5rem', width: '240px', fontSize: '0.85rem' }}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '0.75rem', marginRight: '1rem' }}>
                            <button
                                onClick={() => setActiveTab('national')}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    background: activeTab === 'national' ? '#fff' : 'transparent',
                                    color: activeTab === 'national' ? '#2563eb' : '#64748b',
                                    boxShadow: activeTab === 'national' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                🌐 National
                            </button>
                            <button
                                onClick={() => setActiveTab('hyperlocal')}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    background: activeTab === 'hyperlocal' ? '#fff' : 'transparent',
                                    color: activeTab === 'hyperlocal' ? '#2563eb' : '#64748b',
                                    boxShadow: activeTab === 'hyperlocal' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                📍 Hyperlocal
                            </button>
                        </div>
                        <button className="db-btn db-btn-primary" onClick={() => setIsAddModalOpen(true)}>+ Add New Hub</button>
                    </div>
                </div>

                {/* Desktop View */}
                <div className="db-table-wrapper desktop-only">
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>{activeTab === 'national' ? 'Hub Name' : 'Radius Hub'}</th>
                                <th>{activeTab === 'national' ? 'Coverage' : 'Target Point'}</th>
                                <th>Status</th>
                                <th>Public Link & QR</th>
                                <th>Position</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLocations.map(loc => (
                                <tr key={loc.id}>
                                    <td>
                                        <div
                                            style={{ fontWeight: 800, cursor: 'pointer', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            onClick={() => openManageModal(loc)}
                                        >
                                            {loc.name}
                                            {(loc.scope === 'hyperlocal' || loc.type === 'hyperlocal') && (
                                                <span style={{ fontSize: '0.65rem', background: '#3b82f6', color: '#fff', padding: '1px 4px', borderRadius: '4px' }}>RADIUS</span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{loc.city}, UK</div>
                                    </td>
                                    <td>
                                        {(loc.scope === 'hyperlocal' || loc.type === 'hyperlocal') ? (
                                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', padding: '0.25rem 0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', display: 'inline-block' }}>
                                                📮 {loc.postcode}
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{loc.businessCount || 0} Businesses</div>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`db-badge db-badge-${loc.isActive ? 'approved' : 'rejected'}`}>
                                            {loc.isActive ? 'ACTIVE' : 'PAUSED'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <a
                                                    href={`/r/${loc.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        color: '#2563eb',
                                                        textDecoration: 'none',
                                                        fontWeight: 700,
                                                        fontFamily: 'monospace',
                                                        background: '#eff6ff',
                                                        padding: '0.2rem 0.5rem',
                                                        borderRadius: '4px',
                                                        border: '1px solid rgba(37, 99, 235, 0.1)'
                                                    }}
                                                >
                                                    mcom.links/r/{loc.id}
                                                </a>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                                    <button
                                                        onClick={() => copyToClipboard(`/r/${loc.id}`, loc.id)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                            color: '#64748b',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 700,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                            transition: 'color 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                                                    >
                                                        {copiedId === loc.id ? (
                                                            <span style={{ color: '#10b981' }}>✓ Copied</span>
                                                        ) : (
                                                            <>
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                                                Copy Link
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => openQRModal(loc)}
                                                title="View & Download QR"
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: '#fff',
                                                    padding: '2px',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/r/' + loc.id)}`}
                                                    alt="QR Code"
                                                    style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }} title="Pointer: The current offer index being served. Each scan increments this value.">
                                            <span style={{ fontWeight: 800, color: '#2563eb', cursor: 'help' }}>P-{loc.rotatorConfig?.pointer || 0}</span>
                                            <div style={{ width: '60px', height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                                                <div style={{ width: `${((loc.rotatorConfig?.pointer || 0) / 20) * 100}%`, height: '100%', background: '#2563eb' }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                className="db-btn db-btn-ghost"
                                                style={{ fontSize: '0.75rem', fontWeight: 800 }}
                                                onClick={() => toggleStatus(loc)}
                                            >
                                                {loc.isActive ? 'Pause' : 'Activate'}
                                            </button>
                                            <button
                                                className="db-btn db-btn-ghost"
                                                style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb' }}
                                                onClick={() => resetPointer(loc.id)}
                                            >
                                                Reset P
                                            </button>
                                            <button className="db-btn db-btn-ghost" style={{ padding: '0.4rem' }} onClick={() => openManageModal(loc)}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="mobile-only" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredLocations.map(loc => (
                        <div key={loc.id} className="db-offer-card-mobile">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div
                                    style={{ fontWeight: 800, cursor: 'pointer', color: '#0f172a', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
                                    onClick={() => openManageModal(loc)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {loc.name}
                                        {(loc.scope === 'hyperlocal' || loc.type === 'hyperlocal') && (
                                            <span style={{ fontSize: '0.65rem', background: '#3b82f6', color: '#fff', padding: '1px 4px', borderRadius: '4px' }}>RADIUS</span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{loc.city}, UK</div>
                                </div>
                                <span className={`db-badge db-badge-${loc.isActive ? 'approved' : 'rejected'}`}>
                                    {loc.isActive ? 'ACTIVE' : 'PAUSED'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                {(loc.scope === 'hyperlocal' || loc.type === 'hyperlocal') ? (
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', padding: '0.25rem 0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', display: 'inline-block' }}>
                                        📮 {loc.postcode}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{loc.businessCount || 0} Businesses</div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.8rem' }}>P-{loc.rotatorConfig?.pointer || 0}</span>
                                    <button
                                        onClick={() => copyToClipboard(`/r/${loc.id}`, loc.id)}
                                        style={{
                                            background: '#eff6ff',
                                            border: '1px solid rgba(37, 99, 235, 0.1)',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            color: '#2563eb',
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {copiedId === loc.id ? '✓ Copied' : 'Copy Link'}
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => toggleStatus(loc)}>
                                    {loc.isActive ? 'Pause' : 'Activate'}
                                </button>
                                <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openManageModal(loc)}>
                                    Manage
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rotator Quick Override Grid */}
            <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div className="db-card">
                    <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Global Rotation Engine Health</h2>
                    <div style={{ padding: '2rem', background: '#0a0a0a', borderRadius: '1.25rem', color: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 800 }}>Total Concurrency</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>4,120 Scans/Min</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 800 }}>Engine Load</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>OPTIMAL</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'flex-end' }}>
                            {[40, 60, 45, 90, 100, 80, 50, 40, 60, 70, 85, 95, 40, 30, 60].map((h, i) => (
                                <div key={i} style={{ flex: 1, height: `${h}%`, background: '#2563eb', borderRadius: '2px' }} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="db-card" style={{ border: '2px dashed #e2e8f0', background: 'transparent' }}>
                    <h2 className="db-card-title">Network Quick Override</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                        Manually pause all high-street rotations for emergency maintenance.
                    </p>
                    <button className="db-btn db-btn-primary" style={{ width: '100%', background: '#ef4444', color: '#fff' }}>
                        EMERGENCY SYSTEM PAUSE
                    </button>
                </div>
            </div>

            {/* Add Location Modal */}
            {isAddModalOpen && (
                <div className="db-modal-overlay">
                    <div className="db-modal" style={{ maxWidth: '500px' }}>
                        <div className="db-modal-header">
                            <h3 className="db-card-title">Create New Hub</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="db-btn-close">&times;</button>
                        </div>
                        <form onSubmit={handleAddLocation}>
                            <div className="db-modal-content">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div className="db-form-group">
                                        <label className="db-label">Hub Type</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => setNewLocation({ ...newLocation, type: 'national' })}
                                                className={`db-btn ${newLocation.type === 'national' ? 'db-btn-primary' : 'db-btn-ghost'}`}
                                                style={{ flex: 1, padding: '0.5rem' }}
                                            >
                                                🌐 National
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewLocation({ ...newLocation, type: 'hyperlocal' })}
                                                className={`db-btn ${newLocation.type === 'hyperlocal' ? 'db-btn-primary' : 'db-btn-ghost'}`}
                                                style={{ flex: 1, padding: '0.5rem' }}
                                            >
                                                📍 Hyperlocal
                                            </button>
                                        </div>
                                    </div>
                                    <div className="db-form-group">
                                        <label className="db-label">Location Name</label>
                                        <input
                                            type="text"
                                            className="db-input"
                                            placeholder={newLocation.type === 'national' ? "e.g. Piccadilly Garden Cluster" : "e.g. Soho 5ml Radius Hub"}
                                            required
                                            value={newLocation.name}
                                            onChange={e => setNewLocation({ ...newLocation, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="db-form-group">
                                            <label className="db-label">City</label>
                                            <select
                                                className="db-input"
                                                required
                                                value={newLocation.city}
                                                onChange={e => setNewLocation({ ...newLocation, city: e.target.value })}
                                            >
                                                {ukCities.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="db-form-group">
                                            <label className="db-label">{newLocation.type === 'hyperlocal' ? 'Center Postcode' : 'Base Postcode'}</label>
                                            <input
                                                type="text"
                                                className="db-input"
                                                placeholder="e.g. W1F 0AA"
                                                required
                                                value={newLocation.postcode}
                                                onChange={e => setNewLocation({ ...newLocation, postcode: e.target.value.toUpperCase() })}
                                            />
                                        </div>
                                    </div>
                                    {newLocation.type === 'hyperlocal' && (
                                        <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe' }}>
                                            <p style={{ fontSize: '0.7rem', color: '#1e40af', margin: 0 }}>
                                                <strong>Radius Rule:</strong> This network hub will automatically capture all business offers within a 5-mile radius of <strong>{newLocation.postcode || 'the center'}</strong>.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="db-modal-footer">
                                <button type="button" className="db-btn db-btn-ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="db-btn db-btn-primary">Provision Hub</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rotator Configuration Modal */}
            {isManageModalOpen && selectedLocation && rotatorConfig && (
                <div className="db-modal-overlay">
                    <div className="db-modal" style={{ maxWidth: '900px', width: '90vw' }}>
                        <div className="db-modal-header">
                            <div>
                                <h3 className="db-card-title">Delivery Engine: {selectedLocation.name}</h3>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Advanced sequence and delivery control</p>
                            </div>
                            <button onClick={() => setIsManageModalOpen(false)} className="db-btn-close">&times;</button>
                        </div>
                        <div className="db-modal-content db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
                            {/* Left: General Settings */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRight: '1px solid #f1f5f9', paddingRight: '1.5rem' }}>
                                <div>
                                    <label className="db-label">Rotation Strategy</label>
                                    <select
                                        className="db-input"
                                        value={rotatorConfig.type}
                                        onChange={e => updateConfig({ type: e.target.value as RotationType })}
                                    >
                                        <option value="sequential">Sequential (In Order)</option>
                                        <option value="random">Weighted Random</option>
                                        <option value="scarcity">Scarcity (Click Limited)</option>
                                        <option value="split">Split (Even Alternate)</option>
                                    </select>
                                    <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>
                                        {rotatorConfig.type === 'sequential' && "Offers rotate in the fixed order defined on the right."}
                                        {rotatorConfig.type === 'random' && "Offers are selected randomly based on their weights."}
                                        {rotatorConfig.type === 'scarcity' && "Traffic flows to the first available offer until its limit is hit."}
                                        {rotatorConfig.type === 'split' && "Traffic is distributed based on the number of appearances set per offer."}
                                    </p>
                                </div>

                                <div>
                                    <label className="db-label">Fallback Behavior</label>
                                    <select
                                        className="db-input"
                                        value={rotatorConfig.fallbackBehavior}
                                        onChange={e => updateConfig({ fallbackBehavior: e.target.value as FallbackBehavior })}
                                    >
                                        <option value="default">Branded Default Page</option>
                                        <option value="link">Custom URL Redirect</option>
                                        <option value="expired">"Offer Expired" Notice</option>
                                    </select>
                                    <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>
                                        {rotatorConfig.fallbackBehavior === 'default' && "Shows the global MCOMQ discovery page when the sequence ends."}
                                        {rotatorConfig.fallbackBehavior === 'link' && "Sends the user directly to a custom URL if no active offers are found."}
                                        {rotatorConfig.fallbackBehavior === 'expired' && "Strictly informs the user that the offer they scanned is no longer active."}
                                    </p>
                                </div>

                                {rotatorConfig.fallbackBehavior === 'link' && (
                                    <div className="db-form-group">
                                        <label className="db-label">Custom Redirect URL</label>
                                        <input
                                            type="url"
                                            className="db-input"
                                            placeholder="https://yourbrand.com/special"
                                            value={rotatorConfig.customLink || ''}
                                            onChange={e => updateConfig({ customLink: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div style={{ marginTop: 'auto', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Engine Stats</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                        <span>Rotator Assets:</span>
                                        <span style={{ fontWeight: 700 }}>{rotatorConfig.offerSequence.length}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                        <span>Active Status:</span>
                                        <span style={{ fontWeight: 700, color: '#10b981' }}>HEALTHY</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Sequence & Constraints */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Delivery Sequence</h4>
                                    <button
                                        className="db-btn"
                                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem', background: showAddOfferPanel ? '#f1f5f9' : '#2563eb', color: showAddOfferPanel ? '#64748b' : '#fff' }}
                                        onClick={() => setShowAddOfferPanel(!showAddOfferPanel)}
                                    >
                                        {showAddOfferPanel ? 'Close Panel' : '+ Add Asset'}
                                    </button>
                                </div>

                                {showAddOfferPanel && (
                                    <div className="animate-fade-in" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <input
                                                type="text"
                                                className="db-input"
                                                style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                                                placeholder="Search Offer or Business..."
                                                value={offerSearchTerm}
                                                onChange={e => setOfferSearchTerm(e.target.value)}
                                            />
                                        </div>

                                        <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {/* Results: Businesses */}
                                            {Array.from(new Set(allOffers.map(o => o.businessName))).filter(b => (b?.toLowerCase() || '').includes(offerSearchTerm.toLowerCase())).slice(0, 3).map(business => (
                                                <div key={business} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>🏢 {business}</div>
                                                        <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Add all approved offers</div>
                                                    </div>
                                                    <button className="db-btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }} onClick={() => addBusinessToRotator(business)}>Add All</button>
                                                </div>
                                            ))}

                                            {/* Results: Offers */}
                                            {allOffers.filter(o => ((o.headline?.toLowerCase() || '').includes(offerSearchTerm.toLowerCase()) || (o.businessName?.toLowerCase() || '').includes(offerSearchTerm.toLowerCase())) && !rotatorConfig.offerSequence.includes(o.id)).slice(0, 6).map(offer => (
                                                <div key={offer.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                        <img src={offer.imageUrl} style={{ width: '24px', height: '24px', borderRadius: '4px' }} alt="" />
                                                        <div>
                                                            <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>{offer.headline}</div>
                                                            <div style={{ fontSize: '0.6rem', color: '#64748b' }}>{offer.businessName}</div>
                                                        </div>
                                                    </div>
                                                    <button className="db-btn db-btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }} onClick={() => addOfferToRotator(offer.id)}>Add Offer</button>
                                                </div>
                                            ))}

                                            {offerSearchTerm && allOffers.filter(o => (o.headline?.toLowerCase() || '').includes(offerSearchTerm.toLowerCase())).length === 0 && (
                                                <div style={{ textAlign: 'center', padding: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>No matches found.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                    {getOrderedOffers().map((offer, i) => (
                                        <div key={offer.id} className="db-grid-stack" style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            background: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '0.75rem',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                                <div style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    background: '#f1f5f9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 900,
                                                    color: '#64748b'
                                                }}>{i + 1}</div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{offer.businessName}</div>
                                                        <span
                                                            onClick={() => handleTogglePremium(offer.id)}
                                                            title="Toggle Hyperlocal / Local Status"
                                                            style={{
                                                                cursor: 'pointer',
                                                                background: offer.isPremium ? 'linear-gradient(135deg, #eab308, #d97706)' : '#e2e8f0',
                                                                color: offer.isPremium ? '#fff' : '#64748b',
                                                                fontSize: '0.6rem',
                                                                fontWeight: 900,
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                textTransform: 'uppercase',
                                                                boxShadow: offer.isPremium ? '0 2px 4px rgba(234, 179, 8, 0.3)' : 'none',
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            {offer.isPremium ? 'Hyperlocal' : 'Local'}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                                        {offer.headline}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                                                        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>
                                                            👁️ {(offer.performance?.scans || 0).toLocaleString()} Scans
                                                        </span>
                                                        <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>
                                                            ✅ {(offer.performance?.claims || 0).toLocaleString()} Clicks
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                {/* Type Specific Inputs */}
                                                {(rotatorConfig.type === 'random' || rotatorConfig.type === 'split') && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                                                            {rotatorConfig.type === 'random' ? 'Weight:' : 'Appearances:'}
                                                        </span>
                                                        <input
                                                            type="number"
                                                            className="db-input"
                                                            style={{ width: '45px', padding: '0.2rem 0.3rem', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', background: '#fff' }}
                                                            min="1"
                                                            value={rotatorConfig.weights[offer.id] || 1}
                                                            title={rotatorConfig.type === 'random' ? 'Probability weight' : 'Number of times this offer appears in sequence'}
                                                            onChange={e => updateConfig({
                                                                weights: { ...rotatorConfig.weights, [offer.id]: parseInt(e.target.value) || 1 }
                                                            })}
                                                        />
                                                    </div>
                                                )}

                                                {rotatorConfig.type === 'scarcity' && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Limit:</span>
                                                        <input
                                                            type="number"
                                                            className="db-input"
                                                            style={{ width: '60px', padding: '0.25rem' }}
                                                            min="0"
                                                            placeholder="∞"
                                                            value={rotatorConfig.scarcityLimits[offer.id] || ''}
                                                            onChange={e => updateConfig({
                                                                scarcityLimits: { ...rotatorConfig.scarcityLimits, [offer.id]: parseInt(e.target.value) || 0 }
                                                            })}
                                                        />
                                                    </div>
                                                )}

                                                {/* Reordering Buttons */}
                                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                    <button
                                                        className="db-btn db-btn-ghost"
                                                        style={{ padding: '0.25rem' }}
                                                        disabled={i === 0}
                                                        onClick={() => moveOffer(i, 'up')}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                                                    </button>
                                                    <button
                                                        className="db-btn db-btn-ghost"
                                                        style={{ padding: '0.25rem' }}
                                                        disabled={i === getOrderedOffers().length - 1}
                                                        onClick={() => moveOffer(i, 'down')}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                    </button>
                                                    <button
                                                        className="db-btn db-btn-ghost"
                                                        style={{ padding: '0.25rem', color: '#ef4444' }}
                                                        title="Remove from sequence"
                                                        onClick={() => removeOfferFromRotator(offer.id)}
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="db-modal-footer">
                            <button className="db-btn db-btn-ghost" onClick={() => setIsManageModalOpen(false)}>Discard</button>
                            <button className="db-btn db-btn-primary" onClick={handleSaveConfig}>Save Rotator Profile</button>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Download Modal */}
            {isQRModalOpen && selectedQRLocation && (
                <div className="db-modal-overlay">
                    <div className="db-modal" style={{ maxWidth: '450px', textAlign: 'center' }}>
                        <div className="db-modal-header">
                            <div>
                                <h3 className="db-card-title">Production QR Asset</h3>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Hub ID: {selectedQRLocation.id}</p>
                            </div>
                            <button onClick={() => setIsQRModalOpen(false)} className="db-btn-close">&times;</button>
                        </div>
                        <div className="db-modal-content" style={{ padding: '2rem' }}>
                            <div style={{
                                background: '#fff',
                                padding: '1.5rem',
                                borderRadius: '1.25rem',
                                border: '2px solid #f1f5f9',
                                display: 'inline-block',
                                marginBottom: '1.5rem',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                            }}>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin + '/r/' + selectedQRLocation.id)}`}
                                    alt="QR Code Large"
                                    style={{ width: '250px', height: '250px', display: 'block' }}
                                />
                            </div>
                            <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{selectedQRLocation.name}</h4>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>
                                This QR code links directly to the sequence engine for this location.
                                Download it for use in physical storefronts or NFC tags.
                            </p>

                            <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <a
                                    href={`/r/${selectedQRLocation.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="db-btn db-btn-ghost"
                                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                    Test Link
                                </a>
                                <button
                                    className="db-btn db-btn-primary"
                                    onClick={() => downloadQR(selectedQRLocation)}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                    Download PNG
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
