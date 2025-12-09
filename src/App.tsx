import React, { useState, useEffect } from 'react';
import { Lock, LayoutDashboard, Calendar, MessageSquare, DollarSign, RefreshCw, Settings as SettingsIcon } from 'lucide-react';
import LoginPage from './components/LoginPage';
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

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      setIsUnlocked(true);
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    if (AuthService.login(username, password)) {
      setIsUnlocked(true);
    }
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
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-gray-900">📊 Gîte Master</h1>
            
            <nav className="flex items-center gap-1">
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
    </div>
  );
}

export default App;
