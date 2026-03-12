import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    type?: 'info' | 'error' | 'success' | 'warning'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, type = 'info' }) => {
    // Lock scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const getIcon = () => {
        switch (type) {
            case 'error': return '⚠️'
            case 'success': return '✅'
            case 'warning': return '🟡'
            default: return 'ℹ️'
        }
    }

    const getAccentColor = () => {
        switch (type) {
            case 'error': return '#ef4444'
            case 'success': return '#10b981'
            case 'warning': return '#f59e0b'
            default: return '#2563eb'
        }
    }

    return createPortal(
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            {/* Backdrop */}
            <div 
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)',
                    zIndex: -1
                }} 
            />

            {/* Modal Content */}
            <div style={{
                background: '#fff',
                width: '100%',
                maxWidth: '440px',
                borderRadius: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <div style={{
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '1rem'
                    }}>{getIcon()}</div>

                    {title && (
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: 900,
                            color: '#0f172a',
                            marginBottom: '0.75rem',
                            letterSpacing: '-0.02em'
                        }}>{title}</h3>
                    )}

                    <div style={{
                        color: '#64748b',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        lineHeight: 1.6,
                        marginBottom: '2rem'
                    }}>{children}</div>

                    <button 
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            background: getAccentColor(),
                            color: '#fff',
                            border: 'none',
                            borderRadius: '1rem',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            boxShadow: `0 4px 12px ${getAccentColor()}40`,
                            transition: 'transform 0.2s ease, filter 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Understood
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>,
        document.body
    )
}

export default Modal
