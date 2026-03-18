export interface Ad {
  id: string;
  category: string;
  title: string;
  business: string;
  imgPlaceholder: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const mockAdData: Ad[] = [
  // Approved Ads (will show on homepage)
  { id: 'ad-001', category: "Food & Drink", title: "2-for-1 Artisan Coffee", business: "The Daily Grind", imgPlaceholder: "☕", status: 'approved' },
  { id: 'ad-002', category: "Retail", title: "30% Off All Winter Jackets", business: "Outdoor Adventures Co.", imgPlaceholder: "🧥", status: 'approved' },
  { id: 'ad-003', category: "Services", title: "First Haircut Free for New Clients", business: "Precision Cuts Barbershop", imgPlaceholder: "✂️", status: 'approved' },
  { id: 'ad-004', category: "Entertainment", title: "50% Off Movie Tickets on Tuesdays", business: "Grandview Cinema", imgPlaceholder: "🎬", status: 'approved' },
  { id: 'ad-005', category: "Health & Wellness", title: "Join for a Month, Get One Free", business: "Flow Yoga Studio", imgPlaceholder: "🧘", status: 'approved' },
  { id: 'ad-006', category: "Retail", title: "New Spring Collection Arrives", business: "The Fashion Boutique", imgPlaceholder: "👗", status: 'approved' },

  // Pending Ads (will show on the new approval page)
  { id: 'ad-007', category: "Automotive", title: "Free Car Wash with Full Service", business: "Speedy Auto Repair", imgPlaceholder: "🚗", status: 'pending' },
  { id: 'ad-008', category: "Food & Drink", title: "Family Pizza Deal - Just $25", business: "Nonna's Pizzeria", imgPlaceholder: "🍕", status: 'pending' },
  { id: 'ad-009', category: "Electronics", title: "10% Off All Headphones", business: "SoundScape Electronics", imgPlaceholder: "🎧", status: 'pending' },
  { id: 'ad-010', category: "Books", title: "Buy One Get One Free on All Paperbacks", business: "The Reading Nook", imgPlaceholder: "📚", status: 'pending' },

  // Rejected Ads (will not be shown)
  { id: 'ad-011', category: "Services", title: "Title with typo", business: "Biz Name", imgPlaceholder: "📝", status: 'rejected' },
];
