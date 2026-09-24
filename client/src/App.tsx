import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/authContext';
import { Navbar } from './components/Navbar';
import { EmergencyModal } from './components/EmergencyModal';
import { GroundingTool } from './components/GroundingTool';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SurvivorDashboard } from './pages/SurvivorDashboard';
import { CheckInPage } from './pages/CheckInPage';
import { HistoryPage } from './pages/HistoryPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { CounselorDashboard } from './pages/CounselorDashboard';
import { PatientDetailsPage } from './pages/PatientDetailsPage';
import { SettingsPage } from './pages/SettingsPage';

// Protected Route wrapper requiring login
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d]">
        <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If a survivor tries to access counselor route or vice versa
    return <Navigate to={user.role === 'counselor' ? '/counselor/dashboard' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

const MainAppContent: React.FC = () => {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isGlobalGroundingOpen, setIsGlobalGroundingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0f1d] flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Global Trauma-Safe Navigation */}
      <Navbar onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)} />

      {/* Global Grounding Tool Overlay */}
      {isGlobalGroundingOpen && (
        <div className="max-w-4xl mx-auto px-4 py-4 w-full">
          <GroundingTool onClose={() => setIsGlobalGroundingOpen(false)} />
        </div>
      )}

      {/* Main Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Survivor Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['survivor', 'admin']}>
                <SurvivorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/check-in"
            element={
              <ProtectedRoute allowedRoles={['survivor', 'admin']}>
                <CheckInPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute allowedRoles={['survivor', 'admin']}>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Shared Resources Hub */}
          <Route path="/resources" element={<ResourcesPage />} />

          {/* Counselor Professional Routes */}
          <Route
            path="/counselor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['counselor', 'admin']}>
                <CounselorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/counselor/patient/:id"
            element={
              <ProtectedRoute allowedRoles={['counselor', 'admin']}>
                <PatientDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Settings Route */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Emergency Crisis Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onOpenGrounding={() => setIsGlobalGroundingOpen(true)}
      />

      {/* Footer with safety reminder */}
      <footer className="border-t border-gray-800/60 py-6 px-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>MindGuard AI — End-to-end trauma distress prediction & clinical companion</span>
          </div>
          <div className="text-gray-400">
            If in immediate life-threatening physical danger, dial 911 (US) or local emergency services.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
