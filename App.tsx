import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen selection:bg-[#1fa84f]/30">
      {/* Simple header with login button */}
      {!isDashboard && (
        <header className="bg-[#0b0f1a] border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-end items-center">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              Access Dashboard
            </button>
          </div>
        </header>
      )}
      
      <main className="flex-grow">
        <AppRoutes 
          onOpenPricing={() => {}}
          onScrollToSection={() => {}}
          hoveredPlanId={null}
          setHoveredPlanId={() => {}}
          journeyStep={{}}
          handleStartJourney={() => {}}
        />
      </main>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToSignup={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default App;