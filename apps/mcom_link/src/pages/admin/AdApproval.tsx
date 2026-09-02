import { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import AdminLayout from '../../components/AdminLayout';
import '../../styles/ad-approval.css';

export default function AdApprovalPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAds = () => {
    setLoading(true);
    api.get<any[]>('/admin/ads')
      .then((data) => {
        setAds(data || []);
        setLoading(false);
      })
      .catch(() => {
        setAds([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleStatusChange = async (adId: string, newStatus: 'approved' | 'rejected') => {
    const previousAds = [...ads];
    // Optimistic update
    setAds(currentAds =>
      currentAds.map(ad =>
        ad.id === adId ? { ...ad, status: newStatus } : ad
      ).filter(ad => ad.status === 'pending')
    );

    try {
      await api.patch(`/admin/ads/${adId}/status`, { status: newStatus });
    } catch (err: any) {
      // Revert state on network error
      setAds(previousAds);
      alert(`Failed to update ad status to ${newStatus}. Reverting change.`);
    }
  };


  const pendingAds = ads.filter(ad => ad.status === 'pending');


  return (
    <AdminLayout title="Ad Approvals">
      <div className="admin-page-content">
        <h1 className="admin-page-title">Ad Approval Queue</h1>
        <p className="admin-page-subtitle">Review and approve or reject advertisements submitted by businesses.</p>

        <div className="ad-approval-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading ad submission queue...</div>
          ) : pendingAds.length > 0 ? (

            <div className="ad-approval-table-wrapper">
              <table className="ad-approval-table">
                <thead>
                    <tr>
                      <th>Creative</th>
                      <th>Details</th>
                      <th>Exposure Config</th>
                      <th>Priority Control</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAds.map((ad) => (
                      <tr key={ad.id}>
                        <td>
                          <div className="ad-creative-cell">
                            <div className="ad-creative-placeholder" style={{ overflow: 'hidden', padding: 0 }}>
                              {ad.imageUrl ? (
                                <img src={ad.imageUrl} alt={ad.headline || ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                ad.imgPlaceholder || '🎨'
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="ad-details">
                            <div className="title" style={{ fontWeight: 800 }}>{ad.headline || ad.title}</div>
                            <div className="category" style={{ fontSize: '0.75rem' }}>{ad.placement || ad.category || 'General'} • {ad.businessName || ad.business}</div>
                          </div>
                        </td>

                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <select 
                              className="admin-select"
                              value={ad.exposureType}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setAds(ads.map(a => a.id === ad.id ? { ...a, exposureType: val } : a));
                              }}
                            >
                              <option value="national">🌐 National</option>
                              <option value="hyperlocal">📍 Hyperlocal</option>
                              <option value="nearby">🚀 Nearby Expansion</option>
                            </select>
                            
                            {ad.exposureType === 'hyperlocal' && (
                              <input 
                                type="text" 
                                className="admin-input" 
                                placeholder="Target Postcode" 
                                value={ad.targetPostcode || ''}
                                onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, targetPostcode: e.target.value.toUpperCase() } : a))}
                              />
                            )}
                            
                            {ad.exposureType === 'nearby' && (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input 
                                  type="text" 
                                  className="admin-input" 
                                  placeholder="Postcode" 
                                  value={ad.targetPostcode || ''}
                                  onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, targetPostcode: e.target.value.toUpperCase() } : a))}
                                />
                                <input 
                                  type="number" 
                                  className="admin-input" 
                                  style={{ width: '80px' }}
                                  placeholder="Radius" 
                                  value={ad.targetRadius || ''}
                                  onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, targetRadius: parseInt(e.target.value) || 0 } : a))}
                                />
                                <span style={{ fontSize: '0.7rem', alignSelf: 'center' }}>km</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 700 }}>
                              <span>PRIORITY WEIGHT</span>
                              <span>{ad.rotatorWeight || 100}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="100" 
                              value={ad.rotatorWeight || 100}
                              onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, rotatorWeight: parseInt(e.target.value) } : a))}
                              className="admin-slider"
                            />
                            <p style={{ fontSize: '0.6rem', color: '#64748b', margin: 0 }}>
                              {ad.rotatorWeight && ad.rotatorWeight > 80 ? '🔥 High Priority' : 'Standard Sequence'}
                            </p>
                          </div>
                        </td>
                        <td className="ad-actions">
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleStatusChange(ad.id, 'rejected')}
                              className="ad-action-btn reject"
                              style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#fef2f2', border: '1px solid #fee2e2' }}
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleStatusChange(ad.id, 'approved')}
                              className="ad-action-btn approve"
                              style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#eef2ff', border: '1px solid #e0e7ff', color: '#4338ca', fontWeight: 800 }}
                            >
                              Approve
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-queue-placeholder">
              <h3 className="empty-queue-title">No Pending Ads</h3>
              <p className="empty-queue-text">The approval queue is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
