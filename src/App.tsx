import React, { useState, useEffect } from 'react';
import { Lock, LayoutDashboard, Calendar, MessageSquare, DollarSign, RefreshCw, Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import LoginPage from './components/LoginPage';
import HelpGuide from './components/HelpGuide';
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

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      setIsUnlocked(true);
    }
  }, []);

  const handleLogin = (username: string, password: string): boolean => {
    if (AuthService.loginWithCredentials(username, password)) {
      setIsUnlocked(true);
      return true;
    }
    return false;
  };

  if (!isUnlocked) {
    return <LoginPage onLogin={handleLogin} />;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 gap-4">
            <h1 className="text-2xl font-bold text-gray-900 flex-shrink-0">📊 Gîte Master</h1>
            
            <div className="flex items-center gap-3 flex-1 justify-end">
              <button
                onClick={() => setShowHelp(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg flex items-center gap-2 transition-all flex-shrink-0"
              >
                <HelpCircle size={18} />
                <span className="hidden sm:inline font-medium">Aide</span>
              </button>
              
              <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide" style={{ maxWidth: 'calc(100vw - 280px)' }}>
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as View)}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm ${
                      currentView === item.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{item.label}</span>
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
