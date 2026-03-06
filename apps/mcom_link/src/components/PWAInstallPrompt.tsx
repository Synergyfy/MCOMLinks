import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
            return
        }

        // Check if user dismissed recently (don't annoy them)
        const dismissed = localStorage.getItem('pwa-install-dismissed')
        if (dismissed) {
            const dismissedAt = parseInt(dismissed)
            const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24)
            if (daysSince < 3) return // Wait 3 days before showing again
        }

        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            // Wait a moment before showing to not be intrusive
            setTimeout(() => setShowPrompt(true), 3000)
        }

        window.addEventListener('beforeinstallprompt', handler)

        // Listen for successful install
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true)
            setShowPrompt(false)
            setDeferredPrompt(null)
        })

        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            setShowPrompt(false)
        }
        setDeferredPrompt(null)
    }

    const handleDismiss = () => {
        setShowPrompt(false)
        localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    }

    if (isInstalled || !showPrompt) return null

    return (
        <div style={{
            position: 'fixed',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: 'calc(100% - 2rem)',
            maxWidth: '420px',
            animation: 'pwaSlideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                        src="/icon-192x192.png"
                        alt="MCOM Links"
                        style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0a0a0a', lineHeight: '1.2' }}>
                            Install MCOM Links
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>
                            Get instant access from your home screen
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            fontSize: '1.2rem',
                            lineHeight: 1,
                            flexShrink: 0,
                        }}
                        aria-label="Dismiss"
                    >
                        ✕
                    </button>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    fontSize: '0.7rem',
                    color: '#64748b',
                    padding: '0.5rem 0.75rem',
                    background: '#f8fafc',
                    borderRadius: '0.75rem',
                }}>
                    <span>⚡ Fast & offline-ready</span>
                    <span>•</span>
                    <span>🚀 Home screen access</span>
                    <span>•</span>
                    <span>🔔 Notifications</span>
                </div>

                <button
                    onClick={handleInstall}
                    style={{
                        width: '100%',
                        padding: '0.85rem',
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '0.85rem',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Install App
                </button>
            </div>

            <style>{`
                @keyframes pwaSlideUp {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}
