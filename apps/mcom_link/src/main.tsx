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

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome.tsx'
import OffersPage from './pages/dashboard/OffersPage.tsx'
import AnalyticsPage from './pages/dashboard/AnalyticsPage.tsx'
import SupportPage from './pages/dashboard/SupportPage.tsx'
import SettingsPage from './pages/dashboard/SettingsPage.tsx'

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Marketing Homepage */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Rotator Storefront Routes (Dynamic) */}
        <Route path="/r/:locationId" element={<StorefrontPage />} />

        {/* Engagement Routes */}
        <Route path="/claim/:offerId" element={<ClaimPage />} />
        <Route path="/redeem/:offerId" element={<RedeemPage />} />
        <Route path="/confirmed/:offerId" element={<ConfirmationPage />} />

        {/* Business Owner Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
        <Route path="/dashboard/offers" element={<ProtectedRoute><OffersPage /></ProtectedRoute>} />
        <Route path="/dashboard/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/dashboard/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Agent Platform Routes */}
        <Route path="/agent" element={<ProtectedRoute><AgentDashboard /></ProtectedRoute>} />
        <Route path="/agent/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
        <Route path="/agent/onboard" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/agent/performance" element={<ProtectedRoute><AgentPerformancePage /></ProtectedRoute>} />
        <Route path="/agent/business/:id" element={<ProtectedRoute><BusinessDetailsPage /></ProtectedRoute>} />
        <Route path="/agent/business/:id/logs" element={<ProtectedRoute><BusinessCommLogPage /></ProtectedRoute>} />

        {/* Admin Platform Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/locations" element={<ProtectedRoute><LocationManager /></ProtectedRoute>} />
        <Route path="/admin/offers" element={<ProtectedRoute><AdminOfferManager /></ProtectedRoute>} />
        <Route path="/admin/merchants" element={<ProtectedRoute><MerchantControl /></ProtectedRoute>} />
        <Route path="/admin/seasons" element={<ProtectedRoute><SeasonalCampaigns /></ProtectedRoute>} />
        <Route path="/admin/identity" element={<ProtectedRoute><IdentityControl /></ProtectedRoute>} />
        <Route path="/admin/health" element={<ProtectedRoute><SystemHealth /></ProtectedRoute>} />

        {/* Global Fallback Route */}
        <Route path="*" element={<FallbackPage />} />
      </Routes>

      {/* PWA Install Prompt — appears globally on all pages */}
      <PWAInstallPrompt />
    </BrowserRouter>
  </StrictMode>,
)
