import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getPromoSettings, savePromoSettings } from '../../mock/promoStore';
import type { PromoSettings } from '../../mock/promoStore';

export default function AdminPromoControl() {
    const [settings, setSettings] = useState<PromoSettings | null>(null);
    const [saveStatus, setSaveStatus] = useState<string>('');
    const [previewMode, setPreviewMode] = useState<boolean>(false);

    useEffect(() => {
        setSettings(getPromoSettings());
    }, []);

    const handleChange = (field: keyof PromoSettings, value: any) => {
        if (!settings) return;
        setSettings({ ...settings, [field]: value });
    };

    const handleSave = () => {
        if (!settings) return;
        savePromoSettings(settings);
        setSaveStatus('Settings saved successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
    };

    if (!settings) return <AdminLayout title="Promo Control"><p>Loading...</p></AdminLayout>;

    return (
        <AdminLayout title="Promo Campaign Control">
            <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                
                {/* Editor Block */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="db-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="db-card-title">Campaign Settings</h2>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                                <input 
                                    type="checkbox" 
                                    checked={settings.promoActive}
                                    onChange={(e) => handleChange('promoActive', e.target.checked)}
                                    style={{ transform: 'scale(1.2)' }}
                                />
                                Enable Promo Campaign
                            </label>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label className="db-label">Start Date</label>
                                <input 
                                    type="date" 
                                    className="db-input" 
                                    value={settings.promoStartDate}
                                    onChange={(e) => handleChange('promoStartDate', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="db-label">End Date</label>
                                <input 
                                    type="date" 
                                    className="db-input" 
                                    value={settings.promoEndDate}
                                    onChange={(e) => handleChange('promoEndDate', e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="db-label">Promo CTALink / Route (e.g. /pricing/promo)</label>
                            <input 
                                type="text" 
                                className="db-input" 
                                value={settings.promoCTALink}
                                onChange={(e) => handleChange('promoCTALink', e.target.value)}
                            />
                        </div>

                        <hr style={{ margin: '2rem 0', borderColor: '#e2e8f0' }} />

                        <h3 className="db-card-title" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Homepage Banner Section</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <label className="db-label" style={{ marginBottom: 0 }}>Homepage Title</label>
                                <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={settings.showPromoTitle} onChange={e => handleChange('showPromoTitle', e.target.checked)} />
                                    Show Title
                                </label>
                            </div>
                            <input 
                                type="text" 
                                className="db-input" 
                                value={settings.homepagePromoTitle}
                                onChange={(e) => handleChange('homepagePromoTitle', e.target.value)}
                                disabled={!settings.showPromoTitle}
                                style={{ opacity: settings.showPromoTitle ? 1 : 0.6 }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <label className="db-label" style={{ marginBottom: 0 }}>Homepage Description</label>
                                <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={settings.showPromoDesc} onChange={e => handleChange('showPromoDesc', e.target.checked)} />
                                    Show Description
                                </label>
                            </div>
                            <textarea 
                                className="db-input" 
                                rows={2}
                                value={settings.homepagePromoDesc}
                                onChange={(e) => handleChange('homepagePromoDesc', e.target.value)}
                                disabled={!settings.showPromoDesc}
                                style={{ opacity: settings.showPromoDesc ? 1 : 0.6 }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    <label className="db-label" style={{ marginBottom: 0 }}>CTA Text</label>
                                    <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={settings.showPromoCTA} onChange={e => handleChange('showPromoCTA', e.target.checked)} />
                                        Show CTA
                                    </label>
                                </div>
                                <input 
                                    type="text" 
                                    className="db-input" 
                                    value={settings.homepagePromoCTAText}
                                    onChange={(e) => handleChange('homepagePromoCTAText', e.target.value)}
                                    disabled={!settings.showPromoCTA}
                                    style={{ opacity: settings.showPromoCTA ? 1 : 0.6 }}
                                />
                            </div>
                            <div>
                                <label className="db-label">Animation Style</label>
                                <select 
                                    className="db-input"
                                    value={settings.animationStyle}
                                    onChange={(e) => handleChange('animationStyle', e.target.value)}
                                >
                                    <option value="none">None</option>
                                    <option value="bounce">Bounce</option>
                                    <option value="pulse">Pulse</option>
                                    <option value="flash">Flash</option>
                                </select>
                            </div>
                        </div>

                        <hr style={{ margin: '2rem 0', borderColor: '#e2e8f0' }} />

                        <h3 className="db-card-title" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Dynamic Content Embed</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                            Insert HTML or Widgets (e.g., countdowns, embedded video). Will render primarily on /pricing/promo and within the homepage banner if enabled.
                        </p>
                        <div style={{ marginBottom: '1rem' }}>
                            <textarea 
                                className="db-input" 
                                rows={10} 
                                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                                value={settings.adminHtmlEmbed}
                                onChange={(e) => handleChange('adminHtmlEmbed', e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                            <button 
                                className="db-btn db-btn-primary" 
                                onClick={handleSave}
                            >
                                Save Settings
                            </button>
                            {saveStatus && <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>{saveStatus}</span>}
                        </div>
                    </div>
                </div>

                {/* Live Preview Block */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="db-card" style={{ height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="db-card-title">Live Preview</h2>
                            <button 
                                className="db-btn db-btn-ghost" 
                                onClick={() => setPreviewMode(!previewMode)}
                                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                            >
                                {previewMode ? 'Collapse Preview' : 'Expand Preview'}
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#0f172a', borderRadius: '1rem', color: 'white' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ 
                                    display: 'inline-block', 
                                    padding: '0.25rem 1rem', 
                                    borderRadius: '50px', 
                                    background: 'rgba(255,255,255,0.1)',
                                    marginBottom: '1rem',
                                    animation: settings.animationStyle !== 'none' ? `${settings.animationStyle} 2s infinite` : ''
                                }}>
                                    ✦ EXCLUSIVE OFFER
                                </div>
                                {settings.showPromoTitle && (
                                    <h3 style={{ fontSize: '2rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {settings.homepagePromoTitle || 'Enter Title'}
                                    </h3>
                                )}
                                {settings.showPromoDesc && (
                                    <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                                        {settings.homepagePromoDesc || 'Enter Description'}
                                    </p>
                                )}

                                {previewMode && (
                                    <div 
                                        style={{ marginTop: '2rem', marginBottom: '2rem', textAlign: 'left', background: 'transparent' }}
                                        dangerouslySetInnerHTML={{ __html: settings.adminHtmlEmbed }}
                                    />
                                )}

                                {settings.showPromoCTA && (
                                    <button style={{ 
                                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)', 
                                        border: 'none', 
                                        color: 'white', 
                                        padding: '0.8rem 2rem', 
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}>
                                        {settings.homepagePromoCTAText || 'CTA text'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                            <strong>Status: </strong> 
                            {settings.promoActive ? (
                                <span style={{ color: '#10b981', fontWeight: 600 }}>Active (Overriding default pricing)</span>
                            ) : (
                                <span style={{ color: '#ef4444', fontWeight: 600 }}>Inactive (Hidden from users)</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
