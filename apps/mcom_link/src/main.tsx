import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Global Styles
import './index.css'
import './styles/storefront.css'

// PWA Install Prompt
import PWAInstallPrompt from './components/PWAInstallPrompt.tsx'

// Pages
import App from './App.tsx' // The homepage/marketing site
import StorefrontPage from './pages/StorefrontPage.tsx'
import ClaimPage from './pages/ClaimPage.tsx'
import RedeemPage from './pages/RedeemPage.tsx'
import ConfirmationPage from './pages/ConfirmationPage.tsx'
import FallbackPage from './pages/FallbackPage.tsx'
import LoginPage from './pages/LoginPage.tsx'

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome.tsx'
import OffersPage from './pages/dashboard/OffersPage.tsx'
import AnalyticsPage from './pages/dashboard/AnalyticsPage.tsx'
import SupportPage from './pages/dashboard/SupportPage.tsx'

// Agent Pages
import AgentDashboard from './pages/agent/AgentDashboard.tsx'
import PortfolioPage from './pages/agent/PortfolioPage.tsx'
import OnboardingPage from './pages/agent/OnboardingPage.tsx'
import AgentPerformancePage from './pages/agent/AgentPerformancePage.tsx'
import BusinessDetailsPage from './pages/agent/BusinessDetailsPage.tsx'
import BusinessCommLogPage from './pages/agent/BusinessCommLogPage.tsx'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.tsx'
import LocationManager from './pages/admin/LocationManager.tsx'
import AdminOfferManager from './pages/admin/AdminOfferManager.tsx'
import MerchantControl from './pages/admin/MerchantControl.tsx'
import SeasonalCampaigns from './pages/admin/SeasonalCampaigns.tsx'
import IdentityControl from './pages/admin/IdentityControl.tsx'
import SystemHealth from './pages/admin/SystemHealth.tsx'
import AdApprovalPage from './pages/admin/AdApproval.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Marketing Homepage */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotator Storefront Routes (Dynamic) */}
        <Route path="/r/:locationId" element={<StorefrontPage />} />

        {/* Engagement Routes */}
        <Route path="/claim/:offerId" element={<ClaimPage />} />
        <Route path="/redeem/:offerId" element={<RedeemPage />} />
        <Route path="/confirmed/:offerId" element={<ConfirmationPage />} />

        {/* Business Owner Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/offers" element={<OffersPage />} />
        <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
        <Route path="/dashboard/support" element={<SupportPage />} />

        {/* Agent Platform Routes */}
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/agent/portfolio" element={<PortfolioPage />} />
        <Route path="/agent/onboard" element={<OnboardingPage />} />
        <Route path="/agent/performance" element={<AgentPerformancePage />} />
        <Route path="/agent/business/:id" element={<BusinessDetailsPage />} />
        <Route path="/agent/business/:id/logs" element={<BusinessCommLogPage />} />

        {/* Admin Platform Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/locations" element={<LocationManager />} />
        <Route path="/admin/offers" element={<AdminOfferManager />} />
        <Route path="/admin/merchants" element={<MerchantControl />} />
        <Route path="/admin/seasons" element={<SeasonalCampaigns />} />
        <Route path="/admin/identity" element={<IdentityControl />} />
        <Route path="/admin/health" element={<SystemHealth />} />
        <Route path="/admin/ad-approval" element={<AdApprovalPage />} />

        {/* Global Fallback Route */}
        <Route path="*" element={<FallbackPage />} />
      </Routes>

      {/* PWA Install Prompt — appears globally on all pages */}
      <PWAInstallPrompt />
    </BrowserRouter>
  </StrictMode>,
)
