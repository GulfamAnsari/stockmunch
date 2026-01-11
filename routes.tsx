
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PrivacyCharter from './pages/PrivacyCharter';
import TermsOfUsage from './pages/TermsOfUsage';
import RegulatoryPolicy from './pages/RegulatoryPolicy';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { PRICING_PLANS } from './constants';

interface AppRoutesProps {
  onOpenPricing: () => void;
  onScrollToSection: (id: string) => void;
  hoveredPlanId: string | null;
  setHoveredPlanId: (id: string | null) => void;
  journeyStep: Record<string, boolean>;
  handleStartJourney: (id: string) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  onOpenPricing,
  onScrollToSection,
  hoveredPlanId,
  setHoveredPlanId,
  journeyStep,
  handleStartJourney
}) => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Home 
            onOpenPricing={onOpenPricing}
            onScrollToSection={onScrollToSection}
            hoveredPlanId={hoveredPlanId}
            setHoveredPlanId={setHoveredPlanId}
            journeyStep={journeyStep}
            handleStartJourney={handleStartJourney}
            pricingPlans={PRICING_PLANS}
          />
        } 
      />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/privacy" element={<PrivacyCharter />} />
      <Route path="/terms" element={<TermsOfUsage />} />
      <Route path="/regulatory" element={<RegulatoryPolicy />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
