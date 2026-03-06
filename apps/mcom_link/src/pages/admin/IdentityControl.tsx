import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { mockTemplate } from '../../mock/admin'

export default function IdentityControl() {
    const [template, setTemplate] = useState(mockTemplate)

    return (
        <AdminLayout title="Global Branding">
            <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>

                {/* 1. Global Visual Config - Step 212-226 */}
                <div className="db-card">
                    <h2 className="db-card-title" style={{ marginBottom: '2rem' }}>Storefront Identity Control</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="db-form-group">
                            <label className="db-label">Primary Brand Color</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    value={template.brandColor}
                                    onChange={e => setTemplate({ ...template, brandColor: e.target.value })}
                                    style={{ width: '64px', height: '44px', padding: '2px', border: '1px solid #e2e8f0', borderRadius: '0.5rem', cursor: 'pointer' }}
                                />
                                <input
                                    type="text"
                                    className="db-input"
                                    value={template.brandColor}
                                    onChange={e => setTemplate({ ...template, brandColor: e.target.value })}
                                    style={{ flex: 1 }}
                                />
                            </div>
                        </div>

                        <div className="db-form-group">
                            <label className="db-label">Main Header Greeting</label>
                            <input
                                type="text"
                                className="db-input"
                                value={template.headerText}
                                onChange={e => setTemplate({ ...template, headerText: e.target.value })}
                            />
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem' }}>This text appears at the top of every consumer storefront scan.</p>
                        </div>

                        <div className="db-form-group">
                            <label className="db-label">Global Footer / Credits</label>
                            <input
                                type="text"
                                className="db-input"
                                value={template.footerText}
                                onChange={e => setTemplate({ ...template, footerText: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Social Engagement Hub</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Show social sharing icons on storefront.</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={template.showSocials}
                                onChange={e => setTemplate({ ...template, showSocials: e.target.checked })}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                        </div>

                        <button className="db-btn db-btn-primary" style={{ marginTop: '1rem', height: '52px', justifyContent: 'center' }} onClick={() => alert("Global Branding Updated! Changes deployed to all rotators.")}>
                            Deploy Brand Identity
                        </button>
                    </div>
                </div>

                {/* 2. Visual Preview - Fixed Layout Constraint (Step 222) */}
                <div>
                    <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Storefront Preview</h2>
                    <div style={{
                        width: '320px',
                        margin: '0 auto',
                        background: '#fff',
                        borderRadius: '2rem',
                        border: '8px solid #0a0a0a',
                        height: '580px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)'
                    }}>
                        {/* Preview Storefront Components */}
                        <div style={{ background: template.brandColor, padding: '1.25rem', textAlign: 'center', color: '#fff' }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>MCOMLINKS</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{template.headerText}</div>
                        </div>

                        <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ height: '200px', background: '#f1f5f9', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>Active Offer Image</div>
                            <div style={{ height: '24px', width: '80%', background: '#f1f5f9', borderRadius: '4px' }} />
                            <div style={{ height: '48px', width: '100%', background: template.brandColor, borderRadius: '12px' }} />
                            <div style={{ height: '40px', width: '100%', border: `1px solid ${template.brandColor}`, borderRadius: '12px' }} />
                        </div>

                        <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{template.footerText}</div>
                        </div>
                    </div>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' }}>
                        Note: Storefront layout is fixed to maintain brand consistency. Admin can only modify content and color tokens.
                    </p>
                </div>

            </div>
        </AdminLayout>
    )
}
