
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PrivacyCharter from './pages/PrivacyCharter';
import TermsOfUsage from './pages/TermsOfUsage';
import RegulatoryPolicy from './pages/RegulatoryPolicy';
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
      <Route path="/privacy" element={<PrivacyCharter />} />
      <Route path="/terms" element={<TermsOfUsage />} />
      <Route path="/regulatory" element={<RegulatoryPolicy />} />
    </Routes>
  );
};

export default AppRoutes;
