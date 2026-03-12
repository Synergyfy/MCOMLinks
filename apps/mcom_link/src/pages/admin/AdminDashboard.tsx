import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Link } from 'react-router-dom'
import { api } from '../../api/apiClient'
import LoadingScreen from '../LoadingScreen'

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState<any>(null)
    const [alerts, setAlerts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [stats, alertsData] = await Promise.all([
                    api.get<any>('/admin/stats'),
                    api.get<any[]>('/admin/alerts')
                ])
                setStatsData(stats)
                setAlerts(alertsData || [])
            } catch (error) {
                console.error('Failed to fetch admin dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    if (loading) return <LoadingScreen />

    const stats = [
        {
            label: 'Active Locations',
            value: statsData?.activeLocations || '0',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
            trend: `Total: ${statsData?.totalLocations || 0}`
        },
        {
            label: 'Active Businesses',
            value: statsData?.activeBusinesses || '0',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>,
            trend: 'Registered Merchants'
        },
        {
            label: 'Active Offers',
            value: statsData?.activeOffers || '0',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>,
            trend: statsData?.healthyVolume || 'Stable'
        },
        {
            label: 'Daily Scans',
            value: statsData?.dailyScans?.toLocaleString() || '0',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>,
            trend: `${statsData?.totalScans?.toLocaleString() || 0} Total`
        },
        {
            label: 'Daily Claims',
            value: statsData?.dailyClaims?.toLocaleString() || '0',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>,
            trend: statsData?.growthRate || 'Tracking'
        }
    ]

    const handleAction = (alert: any) => {
        // Mock action handler for now
        alert('Action triggered: ' + alert.message)
    }

    return (
        <AdminLayout title="Global Overview">
            {/* 1. Global Metrics Grid */}
            <div className="db-stats-grid" style={{ marginBottom: '2.5rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="db-stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '1.25rem' }}>{stat.icon}</span>
                            <span style={{ fontSize: '0.65rem', color: '#2563eb', fontWeight: 800 }}>{stat.trend}</span>
                        </div>
                        <div className="db-stat-label">{stat.label}</div>
                        <div className="db-stat-value">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>

                {/* 2. System Alerts & Heatmap */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="db-card">
                        <h2 className="db-card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> Critical System Alerts
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {alerts.length > 0 ? alerts.map(alert => (
                                <div key={alert.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1.25rem',
                                    background: alert.type === 'error' ? 'rgba(239, 68, 68, 0.05)' : alert.type === 'warning' ? 'rgba(245, 158, 11, 0.05)' : '#f8fafc',
                                    border: `1px solid ${alert.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : alert.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : '#e2e8f0'}`,
                                    borderRadius: '1rem'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0a0a0a' }}>{alert.message}</div>
                                        <div style={{ fontSize: '0.75rem', color: alert.type === 'error' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.25rem' }}>
                                            Source: {alert.source || 'SYSTEM'}
                                        </div>
                                    </div>
                                    <button
                                        className="db-btn db-btn-ghost"
                                        style={{ fontSize: '0.8rem', fontWeight: 800 }}
                                        onClick={() => handleAction(alert)}
                                    >
                                        Review
                                    </button>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    No critical alerts found. System is operational.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="db-card">
                        <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Network Performance Heatmap</h2>
                        <div style={{ height: '240px', background: '#f8fafc', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.9rem', border: '2px dashed #e2e8f0' }}>
                            Global Scan Intensity Visualizer (Real-time)
                        </div>
                    </div>
                </div>

                {/* 3. Quick Actions & Health Mini */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="db-card" style={{ background: '#0a0a0a', color: '#fff' }}>
                        <h2 className="db-card-title" style={{ color: '#fff', marginBottom: '1.5rem' }}>Quick Deployment</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link to="/admin/locations" className="db-btn db-btn-primary" style={{ background: '#fff', color: '#0a0a0a', border: 'none', justifyContent: 'center' }}>
                                Create New Location
                            </Link>
                            <Link to="/admin/merchants" className="db-btn db-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff', justifyContent: 'center' }}>
                                Onboard Business
                            </Link>
                            <Link to="/admin/identity" className="db-btn db-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff', justifyContent: 'center' }}>
                                Deploy Global Template
                            </Link>
                        </div>
                    </div>

                    <div className="db-card">
                        <h2 className="db-card-title" style={{ marginBottom: '1.25rem' }}>System Health</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: '#64748b' }}>Network Status</span>
                                <span style={{ fontWeight: 800, color: statsData?.systemStatus === 'Operational' ? '#10b981' : '#ef4444' }}>
                                    {statsData?.systemStatus || 'Checking...'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: '#64748b' }}>Estimated Revenue</span>
                                <span style={{ fontWeight: 800 }}>{statsData?.revenueEstimated || '£0.00'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: '#64748b' }}>Database Sync</span>
                                <span style={{ fontWeight: 800 }}>Synchronized</span>
                            </div>
                        </div>
                        <Link to="/admin/health" className="db-btn db-btn-ghost" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', fontSize: '0.8rem' }}>
                            Full Infrastructure Log
                        </Link>
                    </div>
                </div>

            </div>
        </AdminLayout>
    )
}
