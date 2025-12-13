import React, { useState, useEffect } from 'react';
import { Lock, LayoutDashboard, Calendar, MessageSquare, DollarSign, RefreshCw, Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import LoginPage from './components/LoginPage';
import HelpGuide from './components/HelpGuide';
import OnboardingWizard from './components/OnboardingWizard';
import GuestGuidePublic from './components/GuestGuidePublic';
import CleaningReportPublic from './components/CleaningReportPublic';
import AdminPage from './components/AdminPage';
import Dashboard from './components/Dashboard';
import CalendarModule from './components/CalendarModule';
import MessagingModule from './components/MessagingModule';
import AccountingModule from './components/AccountingModule';
import SyncModule from './components/SyncModule';
import CleaningModule from './components/CleaningModule';
import AutomationModule from './components/AutomationModule';
import WelcomeGuideModule from './components/WelcomeGuideModule';
import AuthService from './services/AuthService';

type View = 'dashboard' | 'calendar' | 'messaging' | 'accounting' | 'sync' | 'cleaning' | 'automation' | 'guide' | 'admin';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showHelp, setShowHelp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check for public routes
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#guest-guide' || hash === '#cleaning-report') {
      // Public routes, no auth needed
      return;
    }
    
    // Check auth for private routes
    if (AuthService.isAuthenticated()) {
      setIsUnlocked(true);
      
      // Check if onboarding completed
      const onboardingCompleted = localStorage.getItem('gitemaster_onboarding_completed');
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const handleLogin = (username: string, password: string, rememberMe: boolean = false): boolean => {
    if (AuthService.loginWithCredentials(username, password, rememberMe)) {
      setIsUnlocked(true);
      return true;
    }
    return false;
  };

  // Public routes (no auth)
  const hash = window.location.hash;
  if (hash === '#guest-guide') {
    return <GuestGuidePublic />;
  }
  if (hash === '#cleaning-report') {
    return <CleaningReportPublic />;
  }

  // Private routes (auth required)
  if (!isUnlocked) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show onboarding if not completed
  if (showOnboarding) {
    return <OnboardingWizard onComplete={() => setShowOnboarding(false)} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'messaging', label: 'Messages', icon: MessageSquare },
    { id: 'cleaning', label: 'Ménage', icon: LayoutDashboard },
    { id: 'automation', label: 'Auto', icon: RefreshCw },
    { id: 'guide', label: 'Livret', icon: SettingsIcon },
    { id: 'accounting', label: 'Compta', icon: DollarSign },
    { id: 'sync', label: 'Sync', icon: RefreshCw },
    { id: 'admin', label: 'Admin', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 gap-2">
            {/* Logo compact sur mobile */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex-shrink-0">
              <span className="hidden sm:inline">📊 Gîte Master</span>
              <span className="sm:hidden">📊 GM</span>
            </h1>
            
            <div className="flex items-center gap-2 flex-1 justify-end overflow-hidden">
              {/* Bouton aide compact */}
              <button
                onClick={() => setShowHelp(true)}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg flex items-center gap-1 transition-all flex-shrink-0"
              >
                <HelpCircle size={16} />
                <span className="hidden lg:inline text-sm font-medium">Aide</span>
              </button>
              
              {/* Navigation scrollable */}
              <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1" style={{ maxWidth: 'calc(100vw - 140px)' }}>
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as View)}
                    className={`px-2 sm:px-3 py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-xs sm:text-sm flex-shrink-0 ${
                      currentView === item.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[calc(100vh-80px)]">
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
        {currentView === 'calendar' && <CalendarModule />}
        {currentView === 'messaging' && <MessagingModule />}
        {currentView === 'cleaning' && <CleaningModule />}
        {currentView === 'automation' && <AutomationModule />}
        {currentView === 'guide' && <WelcomeGuideModule />}
        {currentView === 'accounting' && <AccountingModule />}
        {currentView === 'sync' && <SyncModule />}
        {currentView === 'admin' && <AdminPage />}
      </div>

      {/* Help Guide Modal */}
      {showHelp && <HelpGuide onClose={() => setShowHelp(false)} />}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default App;
