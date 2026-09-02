export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mcomlinks.onrender.com';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// MCOM Solutions (Central) Stripe publishable key for the in-app card checkout.
// This is Central's key (merchant of record) — it matches the clientSecret
// returned by /api/v1/mcom/packages/purchase/initiate.
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const MCOM_SOLUTIONS_URL = import.meta.env.VITE_MCOM_SOLUTIONS_URL || 'http://localhost:3000';

