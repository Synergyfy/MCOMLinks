import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Global Styles
import './index.css'
import './styles/storefront.css'

// PWA Install Prompt
import PWAInstallPrompt from './components/PWAInstallPrompt.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'

// Pages
import App from './App.tsx' // The homepage/marketing site
import StorefrontPage from './pages/StorefrontPage.tsx'
import ClaimPage from './pages/ClaimPage.tsx'
import RedeemPage from './pages/RedeemPage.tsx'
import ConfirmationPage from './pages/ConfirmationPage.tsx'
import FallbackPage from './pages/FallbackPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import SignupPage from './pages/SignupPage.tsx'
import PricingPage from './pages/PricingPage.tsx'

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome.tsx'
import OffersPage from './pages/dashboard/OffersPage.tsx'
import AnalyticsPage from './pages/dashboard/AnalyticsPage.tsx'
import SupportPage from './pages/dashboard/SupportPage.tsx'
import SettingsPage from './pages/dashboard/SettingsPage.tsx'
import BillingPage from './pages/dashboard/BillingPage.tsx'

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
import PlanConfig from './pages/admin/PlanConfig.tsx'
import AdminPromoControl from './pages/admin/AdminPromoControl.tsx'
import AdminHomePageCMS from './pages/admin/AdminHomePageCMS.tsx'
import PromoPricingPage from './pages/PromoPricingPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Marketing Homepage */}
        <Route path="/" element={<App />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/pricing/promo" element={<PromoPricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Rotator Storefront Routes (Dynamic) */}
        <Route path="/r/:locationId" element={<StorefrontPage />} />

        {/* Engagement Routes */}
        <Route path="/claim/:offerId" element={<ClaimPage />} />
        <Route path="/redeem/:offerId" element={<RedeemPage />} />
        <Route path="/confirmed/:offerId" element={<ConfirmationPage />} />

        {/* Business Owner Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute roles={['BUSINESS']}><DashboardHome /></ProtectedRoute>} />
        <Route path="/dashboard/offers" element={<ProtectedRoute roles={['BUSINESS']}><OffersPage /></ProtectedRoute>} />
        <Route path="/dashboard/analytics" element={<ProtectedRoute roles={['BUSINESS']}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/dashboard/support" element={<ProtectedRoute roles={['BUSINESS']}><SupportPage /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute roles={['BUSINESS']}><SettingsPage /></ProtectedRoute>} />
        <Route path="/dashboard/billing" element={<ProtectedRoute roles={['BUSINESS']}><BillingPage /></ProtectedRoute>} />

        {/* Agent Platform Routes */}
        <Route path="/agent" element={<ProtectedRoute roles={['AGENT']}><AgentDashboard /></ProtectedRoute>} />
        <Route path="/agent/portfolio" element={<ProtectedRoute roles={['AGENT']}><PortfolioPage /></ProtectedRoute>} />
        <Route path="/agent/onboard" element={<ProtectedRoute roles={['AGENT']}><OnboardingPage /></ProtectedRoute>} />
        <Route path="/agent/performance" element={<ProtectedRoute roles={['AGENT']}><AgentPerformancePage /></ProtectedRoute>} />
        <Route path="/agent/business/:id" element={<ProtectedRoute roles={['AGENT']}><BusinessDetailsPage /></ProtectedRoute>} />
        <Route path="/agent/business/:id/logs" element={<ProtectedRoute roles={['AGENT']}><BusinessCommLogPage /></ProtectedRoute>} />

        {/* Admin Platform Routes */}
        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/locations" element={<ProtectedRoute roles={['ADMIN']}><LocationManager /></ProtectedRoute>} />
        <Route path="/admin/offers" element={<ProtectedRoute roles={['ADMIN']}><AdminOfferManager /></ProtectedRoute>} />
        <Route path="/admin/merchants" element={<ProtectedRoute roles={['ADMIN']}><MerchantControl /></ProtectedRoute>} />
        <Route path="/admin/seasons" element={<ProtectedRoute roles={['ADMIN']}><SeasonalCampaigns /></ProtectedRoute>} />
        <Route path="/admin/identity" element={<ProtectedRoute roles={['ADMIN']}><IdentityControl /></ProtectedRoute>} />
        <Route path="/admin/health" element={<ProtectedRoute roles={['ADMIN']}><SystemHealth /></ProtectedRoute>} />
        <Route path="/admin/ad-approval" element={<ProtectedRoute roles={['ADMIN']}><AdApprovalPage /></ProtectedRoute>} />
        <Route path="/admin/plans" element={<ProtectedRoute roles={['ADMIN']}><PlanConfig /></ProtectedRoute>} />
        <Route path="/admin/promo" element={<ProtectedRoute roles={['ADMIN']}><AdminPromoControl /></ProtectedRoute>} />
        <Route path="/admin/home-cms" element={<ProtectedRoute roles={['ADMIN']}><AdminHomePageCMS /></ProtectedRoute>} />

        {/* Global Fallback Route */}
        <Route path="*" element={<FallbackPage />} />
      </Routes>

      {/* PWA Install Prompt — appears globally on all pages */}
      <PWAInstallPrompt />
    </BrowserRouter>
  </StrictMode>,
)
