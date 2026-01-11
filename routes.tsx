
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PrivacyCharter from './pages/PrivacyCharter';
import TermsOfUsage from './pages/TermsOfUsage';
import RegulatoryPolicy from './pages/RegulatoryPolicy';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { PRICING_PLANS } from './constants';

interface AppRoutesProps {
  onOpenPricing: () => void;
  hoveredPlanId: string | null;
  setHoveredPlanId: (id: string | null) => void;
  journeyStep: Record<string, boolean>;
  handleStartJourney: (id: string) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  onOpenPricing,
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
    </Routes>
  );
};

export default AppRoutes;
