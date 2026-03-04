import AdminLayout from '../../components/AdminLayout'
import { systemLogs } from '../../mock/admin'

export default function SystemHealth() {
    return (
        <AdminLayout title="System Integrity">
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>

                {/* 1. Infrastructure Metrics - Step 273-286 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="db-card">
                        <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Infrastructure Logs</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {systemLogs.map(log => (
                                <div key={log.id} style={{
                                    padding: '1rem',
                                    borderRadius: '0.75rem',
                                    background: log.type === 'error' ? '#fef2f2' : log.type === 'warning' ? '#fffbeb' : '#f8fafc',
                                    border: `1px solid ${log.type === 'error' ? '#fee2e2' : log.type === 'warning' ? '#fef3c7' : '#e2e8f0'}`,
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        background: log.type === 'error' ? '#ef4444' : log.type === 'warning' ? '#f59e0b' : '#3b82f6'
                                    }} />
                                    <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>{log.message}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="db-card">
                        <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Atomic Persistence Health</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Redis Pointers</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>CONNECTED</div>
                            </div>
                            <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Sync Latency</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>12ms</div>
                            </div>
                            <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Data Backups</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>SECURE</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Security & Action Logs - Step 290-298 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="db-card">
                        <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Admin Activity History</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {[
                                { user: 'Super Admin', action: 'Reset High Street Rotator', time: '10 mins ago' },
                                { user: 'Ops Manager', action: 'Created "Spring Sale" Offer', time: '1 hour ago' },
                                { user: 'Super Admin', action: 'Updated Global Brand Color', time: '2 hours ago' },
                                { user: 'Ops Manager', action: 'Suspended "FitLife Gym"', time: '4 hours ago' }
                            ].map((log, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem' }}>
                                        {log.user.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{log.user}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{log.action}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '0.2rem' }}>{log.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="db-btn db-btn-ghost" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center', fontSize: '0.8rem' }}>
                            Download Full Security Audit (CSV)
                        </button>
                    </div>
                </div>

            </div>
        </AdminLayout>
    )
}
