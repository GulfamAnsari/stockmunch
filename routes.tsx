
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

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
      <Route path="/dashboard" element={<Dashboard />} />
      {/* PHP pages handle: /, /about, /contact, /privacy, /terms, /regulatory, /login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
