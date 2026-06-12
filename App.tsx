
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ClassifierPage from './pages/ClassifierPage';
import HistoryPage from './pages/HistoryPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AffiliatePage from './pages/AffiliatePage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import { mockBackend } from './lib/mock-backend';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    } catch (error) {
      console.warn("ScrollToTop failed: ", error);
    }
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  const user = mockBackend.getCurrentUser();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<AuthPage />} />
      <Route path="/auth/register" element={<AuthPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/classify" element={<Layout><ClassifierPage /></Layout>} />
      <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
      <Route path="/subscription" element={<Layout><SubscriptionPage /></Layout>} />
      <Route path="/affiliate" element={<Layout><AffiliatePage /></Layout>} />
      <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
      <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/support" element={<Layout><SupportPage /></Layout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
  );
};

export default App;
