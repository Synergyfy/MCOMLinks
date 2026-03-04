// ClaimPage — PRD STEP 6A + STEP 7
// Minimal form: Name, Email, Phone (optional)
// Validates fields, saves data, shows confirmation

import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getOfferById } from '../mock/rotatorEngine'
import { trackEvent } from '../mock/tracker'
import StorefrontFooter from '../components/StorefrontFooter'
import FallbackPage from './FallbackPage'

export default function ClaimPage() {
    const { offerId } = useParams<{ offerId: string }>()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const locationId = searchParams.get('location') || ''

    const offer = offerId ? getOfferById(offerId) : undefined

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [consent, setConsent] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    if (!offer) {
        return <FallbackPage />
    }

    const claimFields = offer.claimFields || []

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        claimFields.forEach((field) => {
            const value = formData[field.name as keyof typeof formData] || ''
            if (field.required && !value.trim()) {
                newErrors[field.name] = `${field.label} is required`
            }
            if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                newErrors[field.name] = 'Please enter a valid email address'
            }
        })

        if (!consent) {
            newErrors.consent = 'Please agree to the terms'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        setSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Log form submission (STEP 8)
        trackEvent('form_submit', locationId, offer.id, {
            name: formData.name,
            email: formData.email,
        })

        // Navigate to confirmation (STEP 7)
        navigate(`/confirmed/${offer.id}?location=${locationId}`)
    }

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error on type
        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev }
                delete next[name]
                return next
            })
        }
    }

    return (
        <div className="sf-container">
            <div className="sf-wrapper">
                <header className="sf-header">
                    <div className="sf-header-inner">
                        <div className="sf-logo">
                            MCOM<span>.LINKS</span>
                        </div>
                        <button className="sf-back-btn" onClick={() => navigate(-1)}>
                            ← Back
                        </button>
                    </div>
                </header>

                <main className="sf-main">
                    {/* Offer summary */}
                    <div className="sf-claim-offer-summary">
                        <div className="sf-business-name">{offer.businessName}</div>
                        <h2 className="sf-claim-headline">{offer.headline}</h2>
                    </div>

                    {/* Claim form */}
                    <form className="sf-claim-form" onSubmit={handleSubmit} noValidate>
                        <h3 className="sf-form-title">Claim Your Offer</h3>
                        <p className="sf-form-subtitle">Fill in your details below to claim this exclusive offer.</p>

                        {claimFields.map((field) => (
                            <div className="sf-form-group" key={field.name}>
                                <label className="sf-form-label" htmlFor={`field-${field.name}`}>
                                    {field.label}
                                    {field.required && <span className="sf-required">*</span>}
                                </label>
                                <input
                                    id={`field-${field.name}`}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={formData[field.name as keyof typeof formData] || ''}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    className={`sf-form-input ${errors[field.name] ? 'sf-input-error' : ''}`}
                                    autoComplete={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'name'}
                                />
                                {errors[field.name] && (
                                    <span className="sf-error-msg">{errors[field.name]}</span>
                                )}
                            </div>
                        ))}

                        {/* Consent checkbox */}
                        <div className="sf-form-group sf-consent-group">
                            <label className="sf-consent-label">
                                <input
                                    type="checkbox"
                                    checked={consent}
                                    onChange={(e) => {
                                        setConsent(e.target.checked)
                                        if (errors.consent) {
                                            setErrors((prev) => {
                                                const next = { ...prev }
                                                delete next.consent
                                                return next
                                            })
                                        }
                                    }}
                                    className="sf-consent-checkbox"
                                />
                                <span>I agree to the <a href="/terms" className="sf-consent-link">Terms & Conditions</a> and <a href="/privacy" className="sf-consent-link">Privacy Policy</a></span>
                            </label>
                            {errors.consent && (
                                <span className="sf-error-msg">{errors.consent}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="sf-cta-button sf-submit-btn"
                            disabled={submitting}
                            id="submit-claim"
                        >
                            <span className="sf-cta-label">
                                {submitting ? 'Submitting...' : 'Submit & Claim'}
                            </span>
                            {!submitting && <span className="sf-cta-arrow">→</span>}
                        </button>
                    </form>
                </main>

                <StorefrontFooter />
            </div>
        </div>
    )
}
