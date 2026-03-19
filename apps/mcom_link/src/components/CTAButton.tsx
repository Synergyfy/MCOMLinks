import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/apiClient'
import type { Offer } from '../types'

interface CTAButtonProps {
    offer: Offer
    locationId: string
}

export default function CTAButton({ offer, locationId }: CTAButtonProps) {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // 1. Mandatory Validation (AS REQUESTED)
        if (!email.trim() || !phone.trim()) {
            setError('Please enter your email and phone to continue.')
            return
        }

        setError('')

        // 2. Capture Lead (Conversion Boost)
        try {
            await api.get(`/r/${locationId}/track/${offer.id}/quick_claim?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`)
        } catch (e) {
            console.error('Failed to capture lead:', e)
        }

        // 3. Log CTA click (Analytics)
        try {
            await api.get(`/r/${locationId}/track/${offer.id}/click`)
        } catch (e) {
            console.error('Failed to track click:', e)
        }

        // 4. Perform original action
        switch (offer.ctaType) {
            case 'claim':
                navigate(`/claim/${offer.id}?location=${locationId}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`)
                break
            case 'redeem':
                navigate(`/redeem/${offer.id}?location=${locationId}`)
                break
            case 'redirect':
                // Log redirect event before opening
                try {
                    await api.get(`/r/${locationId}/track/${offer.id}/redirect`)
                } catch (e) {
                    console.error('Failed to track redirect:', e)
                }
                window.open(offer.redirectUrl || '/', '_blank', 'noopener,noreferrer')
                break
        }
    }

    return (
        <form className="sf-cta-wrap" onSubmit={handleSubmit}>
            <div className="sf-quick-inputs">
                <input
                    type="email"
                    placeholder="Email address *"
                    className={`sf-cta-input ${error && !email ? 'sf-input-error' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="tel"
                    placeholder="Phone number *"
                    className={`sf-cta-input ${error && !phone ? 'sf-input-error' : ''}`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </div>
            
            {error && <p style={{ fontSize: '0.7rem', color: '#ef4444', textAlign: 'center', fontWeight: 700, margin: '-0.25rem 0 0.25rem' }}>{error}</p>}

            <button type="submit" className="sf-cta-button" id={`cta-${offer.id}`}>
                <span className="sf-cta-label">{offer.ctaLabel}</span>
                <span className="sf-cta-arrow">→</span>
            </button>
        </form>
    )
}
