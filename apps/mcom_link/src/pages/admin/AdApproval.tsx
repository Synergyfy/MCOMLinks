import { useState } from 'react';
import { mockAdData } from '../../mock/ads';
import type { Ad } from '../../mock/ads';
import AdminLayout from '../../components/AdminLayout';
import '../../styles/ad-approval.css'; // Import the new styles

export default function AdApprovalPage() {
  const [ads, setAds] = useState<Ad[]>(mockAdData);

  const handleStatusChange = (adId: string, newStatus: 'approved' | 'rejected') => {
    setAds(currentAds =>
      currentAds.map(ad =>
        ad.id === adId ? { ...ad, status: newStatus } : ad
      ).filter(ad => ad.status === 'pending') // Keep only pending ads in the visible list
    );
  };

  const pendingAds = ads.filter(ad => ad.status === 'pending');

  return (
    <AdminLayout title="Ad Approvals">
      <div className="admin-page-content">
        <h1 className="admin-page-title">Ad Approval Queue</h1>
        <p className="admin-page-subtitle">Review and approve or reject advertisements submitted by businesses.</p>

        <div className="ad-approval-container">
          {pendingAds.length > 0 ? (
            <div className="ad-approval-table-wrapper">
              <table className="ad-approval-table">
                <thead>
                  <tr>
                    <th>Creative</th>
                    <th>Details</th>
                    <th>Business</th>
                    <th><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAds.map((ad) => (
                    <tr key={ad.id}>
                      <td>
                        <div className="ad-creative-cell">
                          <div className="ad-creative-placeholder">
                            {ad.imgPlaceholder}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="ad-details">
                          <div className="title">{ad.title}</div>
                          <div className="category">{ad.category}</div>
                        </div>
                      </td>
                      <td>{ad.business}</td>
                      <td className="ad-actions">
                        <button
                          onClick={() => handleStatusChange(ad.id, 'rejected')}
                          className="ad-action-btn reject"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleStatusChange(ad.id, 'approved')}
                          className="ad-action-btn approve"
                        >
                          Approve
                        </button>
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
