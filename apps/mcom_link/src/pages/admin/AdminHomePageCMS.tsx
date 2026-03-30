import { useState, useEffect, useRef, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getHomeSettings, saveHomeSettings, resetHomeSettings } from '../../mock/homeStore';
import type { HomeSettings } from '../../mock/homeStore';

type SectionId = 'navbar' | 'hero' | 'marquee' | 'features' | 'how-it-works' | 'final-cta' | 'footer';

const SECTIONS: { id: SectionId; label: string; icon: string; color: string }[] = [
    { id: 'navbar', label: 'Navigation Bar', icon: '🧭', color: '#6366f1' },
    { id: 'hero', label: 'Hero Section', icon: '⚡', color: '#2563eb' },
    { id: 'marquee', label: 'Scrolling Marquee', icon: '📢', color: '#0891b2' },
    { id: 'features', label: 'Features Grid', icon: '💎', color: '#7c3aed' },
    { id: 'how-it-works', label: 'How It Works', icon: '⚙️', color: '#059669' },
    { id: 'final-cta', label: 'Call To Action', icon: '🚀', color: '#dc2626' },
    { id: 'footer', label: 'Footer', icon: '📋', color: '#475569' },
];

export default function AdminHomePageCMS() {
    const [settings, setSettings] = useState<HomeSettings | null>(null);
    const [activeSection, setActiveSection] = useState<SectionId>('hero');
    const [saveStatus, setSaveStatus] = useState<string>('');
    const [hasChanges, setHasChanges] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        setSettings(getHomeSettings());
    }, []);

    const handleChange = useCallback((field: keyof HomeSettings, value: any) => {
        setSettings(prev => {
            if (!prev) return prev;
            return { ...prev, [field]: value };
        });
        setHasChanges(true);
    }, []);

    const handleFeatureChange = useCallback((index: number, field: 'title' | 'desc', value: string) => {
        setSettings(prev => {
            if (!prev) return prev;
            const newList = [...prev.featuresList];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, featuresList: newList };
        });
        setHasChanges(true);
    }, []);

    const handleStepChange = useCallback((index: number, field: 'title' | 'desc', value: string) => {
        setSettings(prev => {
            if (!prev) return prev;
            const newSteps = [...prev.steps];
            newSteps[index] = { ...newSteps[index], [field]: value };
            return { ...prev, steps: newSteps };
        });
        setHasChanges(true);
    }, []);

    const handleMarqueeChange = useCallback((index: number, value: string) => {
        setSettings(prev => {
            if (!prev) return prev;
            const items = [...prev.marqueeItems];
            items[index] = value;
            return { ...prev, marqueeItems: items };
        });
        setHasChanges(true);
    }, []);

    const handlePublish = () => {
        if (!settings) return;
        saveHomeSettings(settings);
        setHasChanges(false);
        setSaveStatus('Published!');
        setPreviewKey(k => k + 1);
        setTimeout(() => setSaveStatus(''), 3000);
    };

    const handleReset = () => {
        const defaults = resetHomeSettings();
        setSettings(defaults);
        setHasChanges(false);
        setPreviewKey(k => k + 1);
        setShowResetConfirm(false);
        setSaveStatus('Reset to defaults!');
        setTimeout(() => setSaveStatus(''), 3000);
    };

    const handleRefreshPreview = () => {
        if (!settings) return;
        saveHomeSettings(settings);
        setPreviewKey(k => k + 1);
    };

    if (!settings) return <AdminLayout title="Homepage CMS"><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#94a3b8' }}>Loading CMS Engine...</div></AdminLayout>;

    const previewWidth = previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px';

    const gridConfig = `${leftPanelCollapsed ? '60px' : '220px'} 1fr ${rightPanelCollapsed ? '60px' : '360px'}`;

    const activeInfo = SECTIONS.find(s => s.id === activeSection)!;

    const renderEditor = () => {
        switch (activeSection) {
            case 'navbar': return (
                <>
                    <FieldGroup label="Logo Main Text">
                        <input className="cms-input" value={settings.navLogoMain} onChange={e => handleChange('navLogoMain', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Logo Accent Text">
                        <input className="cms-input" value={settings.navLogoAccent} onChange={e => handleChange('navLogoAccent', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Sign In Button Text">
                        <input className="cms-input" value={settings.navSignInText} onChange={e => handleChange('navSignInText', e.target.value)} />
                    </FieldGroup>
                    <Row>
                        <FieldGroup label="Get Started Text">
                            <input className="cms-input" value={settings.navGetStartedText} onChange={e => handleChange('navGetStartedText', e.target.value)} />
                        </FieldGroup>
                        <FieldGroup label="Get Started Link">
                            <input className="cms-input" value={settings.navGetStartedLink} onChange={e => handleChange('navGetStartedLink', e.target.value)} />
                        </FieldGroup>
                    </Row>
                </>
            );
            case 'hero': return (
                <>
                    <FieldGroup label="Badge Text">
                        <input className="cms-input" value={settings.heroBadge} onChange={e => handleChange('heroBadge', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Main Headline" hint="The full headline text. The 'Gradient Word' below will be highlighted.">
                        <textarea className="cms-input cms-textarea" rows={2} value={settings.heroTitle} onChange={e => handleChange('heroTitle', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Gradient Highlight Word" hint="This exact word/phrase from the headline will get the gradient color effect.">
                        <input className="cms-input" value={settings.heroTitleGradient} onChange={e => handleChange('heroTitleGradient', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Description Paragraph">
                        <textarea className="cms-input cms-textarea" rows={3} value={settings.heroDesc} onChange={e => handleChange('heroDesc', e.target.value)} />
                    </FieldGroup>
                    <Divider label="Buttons" />
                    <Row>
                        <FieldGroup label="Primary Button Text">
                            <input className="cms-input" value={settings.heroPrimaryCTA} onChange={e => handleChange('heroPrimaryCTA', e.target.value)} />
                        </FieldGroup>
                        <FieldGroup label="Primary Button Link">
                            <input className="cms-input" value={settings.heroPrimaryLink} onChange={e => handleChange('heroPrimaryLink', e.target.value)} />
                        </FieldGroup>
                    </Row>
                    <FieldGroup label="Secondary Button Text">
                        <input className="cms-input" value={settings.heroSecondaryCTA} onChange={e => handleChange('heroSecondaryCTA', e.target.value)} />
                    </FieldGroup>
                </>
            );
            case 'marquee': return (
                <>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                        These items scroll continuously across the screen between the hero and features sections.
                    </p>
                    {settings.marqueeItems.map((item, i) => (
                        <FieldGroup key={i} label={`Item ${i + 1}`}>
                            <input className="cms-input" value={item} onChange={e => handleMarqueeChange(i, e.target.value)} />
                        </FieldGroup>
                    ))}
                </>
            );
            case 'features': return (
                <>
                    <FieldGroup label="Section Badge">
                        <input className="cms-input" value={settings.featuresBadge} onChange={e => handleChange('featuresBadge', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Section Title">
                        <input className="cms-input" value={settings.featuresTitle} onChange={e => handleChange('featuresTitle', e.target.value)} />
                    </FieldGroup>
                    <Row>
                        <FieldGroup label="Gradient Word">
                            <input className="cms-input" value={settings.featuresTitleGradient} onChange={e => handleChange('featuresTitleGradient', e.target.value)} />
                        </FieldGroup>
                    </Row>
                    <FieldGroup label="Section Description">
                        <textarea className="cms-input cms-textarea" rows={2} value={settings.featuresDesc} onChange={e => handleChange('featuresDesc', e.target.value)} />
                    </FieldGroup>
                    <Divider label="Feature Cards" />
                    {settings.featuresList.map((f, i) => (
                        <div key={i} className="cms-card-block">
                            <div className="cms-card-block-header">
                                <span className="cms-card-block-number">{i + 1}</span>
                                Feature Card {i + 1}
                            </div>
                            <FieldGroup label="Title">
                                <input className="cms-input" value={f.title} onChange={e => handleFeatureChange(i, 'title', e.target.value)} />
                            </FieldGroup>
                            <FieldGroup label="Description">
                                <textarea className="cms-input cms-textarea" rows={2} value={f.desc} onChange={e => handleFeatureChange(i, 'desc', e.target.value)} />
                            </FieldGroup>
                        </div>
                    ))}
                </>
            );
            case 'how-it-works': return (
                <>
                    <FieldGroup label="Section Badge">
                        <input className="cms-input" value={settings.howItWorksBadge} onChange={e => handleChange('howItWorksBadge', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Section Title">
                        <input className="cms-input" value={settings.howItWorksTitle} onChange={e => handleChange('howItWorksTitle', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Gradient Word">
                        <input className="cms-input" value={settings.howItWorksTitleGradient} onChange={e => handleChange('howItWorksTitleGradient', e.target.value)} />
                    </FieldGroup>
                    <Divider label="Process Steps" />
                    {settings.steps.map((s, i) => (
                        <div key={i} className="cms-card-block">
                            <div className="cms-card-block-header">
                                <span className="cms-card-block-number">{String(i + 1).padStart(2, '0')}</span>
                                Step {i + 1}
                            </div>
                            <FieldGroup label="Step Title">
                                <input className="cms-input" value={s.title} onChange={e => handleStepChange(i, 'title', e.target.value)} />
                            </FieldGroup>
                            <FieldGroup label="Step Description">
                                <textarea className="cms-input cms-textarea" rows={2} value={s.desc} onChange={e => handleStepChange(i, 'desc', e.target.value)} />
                            </FieldGroup>
                        </div>
                    ))}
                    <Divider label="Stats & Button" />
                    <Row>
                        <FieldGroup label="Stat Value">
                            <input className="cms-input" value={settings.howItWorksStatValue} onChange={e => handleChange('howItWorksStatValue', e.target.value)} />
                        </FieldGroup>
                        <FieldGroup label="Stat Label">
                            <input className="cms-input" value={settings.howItWorksStatLabel} onChange={e => handleChange('howItWorksStatLabel', e.target.value)} />
                        </FieldGroup>
                    </Row>
                    <FieldGroup label="CTA Button Text">
                        <input className="cms-input" value={settings.howItWorksCTA} onChange={e => handleChange('howItWorksCTA', e.target.value)} />
                    </FieldGroup>
                </>
            );
            case 'final-cta': return (
                <>
                    <FieldGroup label="Badge Text">
                        <input className="cms-input" value={settings.finalBadge} onChange={e => handleChange('finalBadge', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Headline">
                        <textarea className="cms-input cms-textarea" rows={2} value={settings.finalTitle} onChange={e => handleChange('finalTitle', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Gradient Word">
                        <input className="cms-input" value={settings.finalTitleGradient} onChange={e => handleChange('finalTitleGradient', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Description">
                        <textarea className="cms-input cms-textarea" rows={2} value={settings.finalDesc} onChange={e => handleChange('finalDesc', e.target.value)} />
                    </FieldGroup>
                    <Row>
                        <FieldGroup label="Button Label">
                            <input className="cms-input" value={settings.finalCTA} onChange={e => handleChange('finalCTA', e.target.value)} />
                        </FieldGroup>
                        <FieldGroup label="Button Link">
                            <input className="cms-input" value={settings.finalLink} onChange={e => handleChange('finalLink', e.target.value)} />
                        </FieldGroup>
                    </Row>
                </>
            );
            case 'footer': return (
                <>
                    <FieldGroup label="Footer Description">
                        <textarea className="cms-input cms-textarea" rows={3} value={settings.footerDesc} onChange={e => handleChange('footerDesc', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Platform Section Text">
                        <textarea className="cms-input cms-textarea" rows={3} value={settings.footerPlatformDesc} onChange={e => handleChange('footerPlatformDesc', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Copyright Text">
                        <input className="cms-input" value={settings.footerCopyright} onChange={e => handleChange('footerCopyright', e.target.value)} />
                    </FieldGroup>
                </>
            );
        }
    };

    return (
        <AdminLayout title="Homepage CMS">
            <style>{cmsStyles}</style>

            {/* Top Toolbar */}
            <div className="cms-toolbar">
                <div className="cms-toolbar-left">
                    <div className="cms-toolbar-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M20 8l-8 5-8-5"/><path d="M20 16l-8 5-8-5"/></svg>
                        Homepage Editor
                    </div>
                    {hasChanges && <span className="cms-unsaved-badge">● Unsaved Changes</span>}
                    {saveStatus && <span className="cms-saved-badge">{saveStatus}</span>}
                </div>
                <div className="cms-toolbar-right">
                    <div className="cms-view-ctrl">
                        <button className={`cms-device-btn ${!leftPanelCollapsed && !rightPanelCollapsed ? 'active' : ''}`} onClick={() => { setLeftPanelCollapsed(false); setRightPanelCollapsed(false); }} title="Standard View">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                        </button>
                        <button className={`cms-device-btn ${leftPanelCollapsed && rightPanelCollapsed ? 'active' : ''}`} onClick={() => { setLeftPanelCollapsed(true); setRightPanelCollapsed(true); }} title="Zen Mode">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                        </button>
                    </div>
                    <div className="cms-device-switcher">
                        {(['desktop', 'tablet', 'mobile'] as const).map(d => (
                            <button key={d} className={`cms-device-btn ${previewDevice === d ? 'active' : ''}`} onClick={() => setPreviewDevice(d)} title={d}>
                                {d === 'desktop' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
                                {d === 'tablet' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>}
                                {d === 'mobile' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>}
                            </button>
                        ))}
                    </div>
                    <button className="cms-toolbar-btn cms-toolbar-btn-outline" onClick={handleRefreshPreview} title="Refresh Preview">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
                        Preview
                    </button>
                    <button className="cms-toolbar-btn cms-toolbar-btn-outline" onClick={() => setShowResetConfirm(true)} style={{ color: '#ef4444', borderColor: '#fecaca' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                        Reset
                    </button>
                    <button className="cms-toolbar-btn cms-toolbar-btn-publish" onClick={handlePublish} disabled={!hasChanges}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Publish Live
                    </button>
                </div>
            </div>

            {/* Main CMS Body */}
            <div className="cms-body" style={{ gridTemplateColumns: gridConfig }}>
                {/* Left: Section Layers */}
                <div className={`cms-layers ${leftPanelCollapsed ? 'collapsed' : ''}`}>
                    <div className="cms-layers-header-wrapper">
                        {!leftPanelCollapsed && <div className="cms-layers-header">PAGE SECTIONS</div>}
                        <button className="cms-panel-toggle" onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}>
                            {leftPanelCollapsed ? '→' : '←'}
                        </button>
                    </div>
                    {SECTIONS.map(s => (
                        <button
                            key={s.id}
                            className={`cms-layer-btn ${activeSection === s.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveSection(s.id);
                                if (leftPanelCollapsed) setLeftPanelCollapsed(false);
                            }}
                            title={leftPanelCollapsed ? s.label : ''}
                        >
                            <span className="cms-layer-icon" style={{ background: activeSection === s.id ? s.color : '#f1f5f9', color: activeSection === s.id ? '#fff' : s.color }}>{s.icon}</span>
                            {!leftPanelCollapsed && <span className="cms-layer-label">{s.label}</span>}
                            {!leftPanelCollapsed && <svg className="cms-layer-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>}
                        </button>
                    ))}
                </div>

                {/* Center: Live Preview iframe */}
                <div className="cms-preview-area">
                    <div className="cms-preview-frame" style={{ maxWidth: previewWidth }}>
                        <div className="cms-preview-browser-bar">
                            <div className="cms-browser-dots">
                                <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                            </div>
                            <div className="cms-browser-url">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                mcomqlinks.com
                            </div>
                        </div>
                        <iframe
                            ref={iframeRef}
                            key={previewKey}
                            src="/"
                            className="cms-preview-iframe"
                            title="Homepage Preview"
                        />
                    </div>
                </div>

                {/* Right: Property Editor */}
                <div className={`cms-editor ${rightPanelCollapsed ? 'collapsed' : ''}`}>
                    <div className="cms-editor-header">
                        {!rightPanelCollapsed && <span className="cms-editor-section-icon" style={{ background: activeInfo.color }}>{activeInfo.icon}</span>}
                        {!rightPanelCollapsed && (
                            <div style={{ flex: 1 }}>
                                <div className="cms-editor-section-title">{activeInfo.label}</div>
                                <div className="cms-editor-section-hint">Edit properties below, then publish</div>
                            </div>
                        )}
                        <button className="cms-panel-toggle" onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}>
                            {rightPanelCollapsed ? '←' : '→'}
                        </button>
                    </div>
                    {!rightPanelCollapsed && (
                        <div className="cms-editor-scroll">
                            {renderEditor()}
                        </div>
                    )}
                </div>
            </div>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="cms-modal-overlay" onClick={() => setShowResetConfirm(false)}>
                    <div className="cms-modal" onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>Reset to Defaults?</h3>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2rem' }}>This will discard all your CMS changes and restore the original homepage content. This cannot be undone.</p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                            <button className="cms-toolbar-btn cms-toolbar-btn-outline" onClick={() => setShowResetConfirm(false)}>Cancel</button>
                            <button className="cms-toolbar-btn" style={{ background: '#ef4444', color: 'white', border: 'none' }} onClick={handleReset}>Yes, Reset Everything</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

/* Reusable sub-components */
function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="cms-field">
            <label className="cms-field-label">{label}</label>
            {hint && <p className="cms-field-hint">{hint}</p>}
            {children}
        </div>
    );
}
function Row({ children }: { children: React.ReactNode }) {
    return <div className="cms-row">{children}</div>;
}
function Divider({ label }: { label: string }) {
    return <div className="cms-divider"><span>{label}</span></div>;
}

/* ─── Styles ─── */
const cmsStyles = `
/* Toolbar */
.cms-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.75rem 1.25rem; background: #fff;
    border: 1px solid #e2e8f0; border-radius: 1rem;
    margin-bottom: 1rem; gap: 1rem; flex-wrap: wrap;
}
.cms-toolbar-left { display: flex; align-items: center; gap: 1rem; }
.cms-toolbar-right { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.cms-toolbar-title { display: flex; align-items: center; gap: 0.5rem; font-weight: 900; font-size: 1rem; color: #0f172a; }
.cms-unsaved-badge { font-size: 0.7rem; font-weight: 700; color: #f59e0b; background: #fef3c7; padding: 0.2rem 0.6rem; border-radius: 50px; }
.cms-saved-badge { font-size: 0.7rem; font-weight: 700; color: #10b981; background: #d1fae5; padding: 0.2rem 0.6rem; border-radius: 50px; animation: fadeIn 0.3s ease; }
.cms-device-switcher { display: flex; border: 1px solid #e2e8f0; border-radius: 0.5rem; overflow: hidden; }
.cms-device-btn { padding: 0.4rem 0.6rem; background: #fff; border: none; cursor: pointer; color: #94a3b8; display: flex; align-items: center; transition: all 0.15s; }
.cms-device-btn:not(:last-child) { border-right: 1px solid #e2e8f0; }
.cms-device-btn.active { background: #2563eb; color: #fff; }
.cms-toolbar-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; border-radius: 0.5rem; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.15s; border: none; }
.cms-toolbar-btn-outline { background: #fff; color: #475569; border: 1px solid #e2e8f0 !important; }
.cms-toolbar-btn-outline:hover { background: #f8fafc; }
.cms-toolbar-btn-publish { background: #2563eb; color: #fff; }
.cms-toolbar-btn-publish:hover { background: #1d4ed8; }
.cms-toolbar-btn-publish:disabled { background: #94a3b8; cursor: not-allowed; }

.cms-view-ctrl { display: flex; border: 1px solid #e2e8f0; border-radius: 0.5rem; overflow: hidden; margin-right: 0.5rem; }

/* Body Layout */
.cms-body {
    display: grid;
    grid-template-columns: 220px 1fr 360px;
    gap: 0;
    background: #fff;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    min-height: calc(100vh - 220px);
    box-shadow: 0 20px 60px -15px rgba(0,0,0,0.08);
}

/* Layers Panel */
.cms-layers { background: #fafbfc; border-right: 1px solid #e2e8f0; padding: 1.25rem 0.75rem; display: flex; flex-direction: column; gap: 0.25rem; }
.cms-layers-header { font-size: 0.6rem; font-weight: 900; color: #94a3b8; letter-spacing: 0.12em; text-transform: uppercase; padding: 0 0.75rem; margin-bottom: 0.75rem; }
.cms-layer-btn {
    display: flex; align-items: center; gap: 0.65rem;
    padding: 0.65rem 0.75rem; border: none; border-radius: 0.6rem;
    font-size: 0.82rem; font-weight: 600; color: #475569;
    cursor: pointer; background: transparent; width: 100%;
    text-align: left; transition: all 0.15s;
}
.cms-layer-btn:hover { background: #f1f5f9; }
.cms-layer-btn.active { background: #eff6ff; color: #1d4ed8; font-weight: 800; }
.cms-layer-icon { width: 28px; height: 28px; border-radius: 0.4rem; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0; transition: all 0.15s; }
.cms-layer-label { flex: 1; }
.cms-layer-arrow { color: #cbd5e1; flex-shrink: 0; }
.cms-layer-btn.active .cms-layer-arrow { color: #2563eb; }

/* Preview Panel */
.cms-preview-area {
    background: #f1f5f9; padding: 1.5rem; display: flex;
    align-items: flex-start; justify-content: center; overflow: auto;
}
.cms-preview-frame {
    width: 100%; transition: max-width 0.4s ease;
    border-radius: 0.75rem; overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
    background: #fff;
}
.cms-preview-browser-bar {
    background: #f8fafc; border-bottom: 1px solid #e2e8f0;
    padding: 0.6rem 1rem; display: flex; align-items: center; gap: 1rem;
}
.cms-browser-dots { display: flex; gap: 0.35rem; }
.cms-browser-dots .dot { width: 10px; height: 10px; border-radius: 50%; }
.cms-browser-dots .red { background: #ef4444; } .cms-browser-dots .yellow { background: #f59e0b; } .cms-browser-dots .green { background: #10b981; }
.cms-browser-url { flex: 1; text-align: center; font-size: 0.7rem; color: #94a3b8; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.35rem; }
.cms-preview-iframe { width: 100%; height: calc(100vh - 300px); border: none; display: block; }

/* Editor Panel */
.cms-editor { border-left: 1px solid #e2e8f0; display: flex; flex-direction: column; }
.cms-editor-header {
    padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0;
    display: flex; align-items: center; gap: 0.85rem; flex-shrink: 0;
}
.cms-editor-section-icon { width: 36px; height: 36px; border-radius: 0.6rem; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: #fff; flex-shrink: 0; }
.cms-editor-section-title { font-weight: 900; font-size: 0.95rem; color: #0f172a; }
.cms-editor-section-hint { font-size: 0.7rem; color: #94a3b8; margin-top: 0.15rem; }
.cms-editor-scroll { padding: 1.5rem; overflow-y: auto; flex: 1; }

/* Form Fields */
.cms-field { margin-bottom: 1.25rem; }
.cms-field-label { display: block; font-size: 0.72rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
.cms-field-hint { font-size: 0.7rem; color: #94a3b8; margin: -0.15rem 0 0.5rem; line-height: 1.4; }
.cms-input {
    width: 100%; padding: 0.6rem 0.85rem; border: 1.5px solid #e2e8f0;
    border-radius: 0.5rem; font-size: 0.85rem; color: #0f172a;
    background: #fff; transition: all 0.15s; font-family: inherit;
    box-sizing: border-box;
}
.cms-input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
.cms-textarea { resize: vertical; min-height: 60px; line-height: 1.6; }
.cms-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.cms-divider {
    display: flex; align-items: center; gap: 0.75rem;
    margin: 1.5rem 0 1.25rem; font-size: 0.65rem; font-weight: 900;
    color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;
}
.cms-divider::before, .cms-divider::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }

/* Nested Card Blocks */
.cms-card-block {
    background: #fafbfc; border: 1px solid #e2e8f0;
    border-radius: 0.6rem; padding: 1rem; margin-bottom: 1rem;
}
.cms-card-block-header { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 800; color: #475569; margin-bottom: 1rem; }
.cms-card-block-number { width: 22px; height: 22px; background: #2563eb; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 900; }

.cms-layers-header-wrapper { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; padding: 0 0.75rem; min-height: 24px; }
.cms-panel-toggle { border: none; background: #f1f5f9; color: #64748b; font-size: 0.7rem; font-weight: 900; width: 20px; height: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.cms-panel-toggle:hover { background: #e2e8f0; color: #0f172a; }

.cms-layers.collapsed { padding: 1.25rem 0.5rem; }
.cms-layers.collapsed .cms-layers-header-wrapper { justify-content: center; padding: 0; }
.cms-layers.collapsed .cms-layer-btn { justify-content: center; padding: 0.65rem 0; }

.cms-editor.collapsed { width: 60px; overflow: hidden; }
.cms-editor.collapsed .cms-editor-header { justify-content: center; padding: 1rem 0; }

/* Modal */
.cms-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(4px); }
.cms-modal { background: #fff; border-radius: 1rem; padding: 2.5rem; text-align: center; max-width: 400px; width: 90%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }

/* Animations */
@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

/* Responsive */
@media (max-width: 1200px) {
    .cms-body { grid-template-columns: 1fr !important; }
    .cms-layers { flex-direction: row; overflow-x: auto; border-right: none; border-bottom: 1px solid #e2e8f0; padding: 0.75rem; }
    .cms-layers-header { display: none; }
    .cms-layer-btn { white-space: nowrap; }
    .cms-preview-area { min-height: 400px; }
    .cms-editor { border-left: none; border-top: 1px solid #e2e8f0; }
}
`;
