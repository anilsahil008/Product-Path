import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Chat from './components/Chat'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import LandingPage from './pages/LandingPage'
import EnterprisePage from './pages/EnterprisePage'
import ProtectedRoute from './components/ProtectedRoute'
import PlaceholderPage from './pages/PlaceholderPage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import BillingPage from './pages/BillingPage'
import HowAIWorksPage from './pages/HowAIWorksPage'

const DocIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
)
const ProductIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
  </svg>
)
const TemplateIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25" />
  </svg>
)

function MaintenanceBanner() {
  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center">
      <p className="text-[13px] text-amber-400 font-medium">
        🔧 We're currently performing maintenance — some features may be temporarily unavailable. Thanks for your patience.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="h-full flex flex-col">
          <MaintenanceBanner />
          <div className="flex-1 min-h-0">
          <Routes>
            {/* ── Public marketing routes ───────────────────────────────── */}
            <Route path="/"          element={<LandingPage />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/signup"    element={<SignupPage />} />
            <Route path="/enterprise" element={<EnterprisePage />} />
            <Route path="/pricing"      element={<LandingPage />} />
            <Route path="/resources"    element={<LandingPage />} />
            <Route path="/how-ai-works" element={<HowAIWorksPage />} />

            {/* ── /app → /app/chat redirect ─────────────────────────────── */}
            <Route path="/app" element={<Navigate to="/app/chat" replace />} />

            {/* ── Protected app routes ──────────────────────────────────── */}
            <Route path="/app/chat" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />

            <Route path="/app/documents" element={
              <ProtectedRoute>
                <div className="flex h-full">
                  <PlaceholderPage title="Documents" description="Your PRDs, specs, and product docs will live here." icon={DocIcon} />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/app/products" element={
              <ProtectedRoute>
                <div className="flex h-full">
                  <PlaceholderPage title="Products" description="Track your products and roadmaps here." icon={ProductIcon} />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/app/templates" element={
              <ProtectedRoute>
                <div className="flex h-full">
                  <PlaceholderPage title="Templates" description="Reusable PM templates and frameworks." icon={TemplateIcon} />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/app/settings/profile" element={
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            } />

            <Route path="/app/settings/billing" element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            } />

            <Route path="/app/projects/:id" element={
              <ProtectedRoute>
                <div className="flex h-full">
                  <PlaceholderPage title="Project" description="Your project workspace will live here." icon={DocIcon} />
                </div>
              </ProtectedRoute>
            } />
          </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
