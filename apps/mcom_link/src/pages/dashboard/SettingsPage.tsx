import { useEffect, useState } from 'react'
import { api } from '../../api/apiClient'
import DashboardLayout from '../../components/DashboardLayout'
import '../../styles/dashboard.css'

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logoUrl: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        primaryColor: '#2563eb',
        secondaryColor: '#f8fafc'
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await api.get<any>('/dashboard/settings')
                if (data) {
                    setFormData({
                        name: data.name || '',
                        description: data.description || '',
                        logoUrl: data.logoUrl || '',
                        contactEmail: data.contactEmail || '',
                        contactPhone: data.contactPhone || '',
                        address: data.address || '',
                        primaryColor: data.primaryColor || '#2563eb',
                        secondaryColor: data.secondaryColor || '#f8fafc'
                    })
                }
            } catch (err: any) {
                // If 404, it just means the business hasn't set up their profile yet
                // We don't want to show an error message for this.
                if (err.message?.includes('404') || err.message?.includes('not found')) {
                    console.log('No business profile found. Using defaults for new setup.')
                    
                    // Try to pre-fill from stored user info
                    const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
                    if (storedUser.email) {
                        setFormData(prev => ({ 
                            ...prev, 
                            contactEmail: storedUser.email,
                            name: storedUser.name || ''
                        }))
                    }
                } else {
                    console.error('Failed to fetch settings:', err)
                    setMessage({ type: 'error', text: 'Failed to load settings. Please try again later.' })
                }
            } finally {
                setLoading(false)
            }
        }
 
        fetchSettings()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        try {
            await api.patch('/dashboard/settings', formData)
            setMessage({ type: 'success', text: 'Settings updated successfully!' })
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage(null)
            }, 3000)
        } catch (err: any) {
            console.error('Failed to update settings:', err)
            setMessage({ type: 'error', text: err.message || 'Failed to update settings. Please try again.' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <DashboardLayout title="Business Settings">
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your settings...</div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout title="Business Settings">
            <div className="db-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Business Profile</h2>
                
                {message && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '0.5rem',
                        background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: message.type === 'success' ? '#166534' : '#991b1b',
                        border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="name" style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Business Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="db-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Bella's Boutique"
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                        />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="description" style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="db-input"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Brief description of your business..."
                            rows={4}
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', resize: 'vertical' }}
                        />
                    </div>
                    
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="logoUrl" style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Logo URL</label>
                        <input
                            type="url"
                            id="logoUrl"
                            name="logoUrl"
                            className="db-input"
                            value={formData.logoUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/logo.png"
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                        />
                        {formData.logoUrl && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <img src={formData.logoUrl} alt="Logo Preview" style={{ height: '60px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #e2e8f0' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="contactEmail" style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Contact Email</label>
                            <input
                                type="email"
                                id="contactEmail"
                                name="contactEmail"
                                className="db-input"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                required
                                placeholder="hello@example.com"
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                            />
                        </div>

                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="contactPhone" style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Contact Phone</label>
                            <input
                                type="tel"
                                id="contactPhone"
                                name="contactPhone"
                                className="db-input"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="+44 123 456 789"
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="address" style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Physical Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            className="db-input"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 High St, London"
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                        />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="primaryColor" style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Primary Brand Color</label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    id="primaryColor"
                                    name="primaryColor"
                                    value={formData.primaryColor || '#2563eb'}
                                    onChange={handleChange}
                                    style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                />
                                <input
                                    type="text"
                                    value={formData.primaryColor || '#2563eb'}
                                    onChange={handleChange}
                                    name="primaryColor"
                                    pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                                    className="db-input"
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', textTransform: 'uppercase' }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="secondaryColor" style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Secondary Brand Color</label>
                             <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    id="secondaryColor"
                                    name="secondaryColor"
                                    value={formData.secondaryColor || '#f8fafc'}
                                    onChange={handleChange}
                                    style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                />
                                <input
                                    type="text"
                                    value={formData.secondaryColor || '#f8fafc'}
                                    onChange={handleChange}
                                    name="secondaryColor"
                                    pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                                    className="db-input"
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', textTransform: 'uppercase' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                        <button
                            type="submit"
                            className="db-btn db-btn-primary"
                            disabled={saving}
                            style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}
