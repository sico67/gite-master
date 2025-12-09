import React, { useState, useEffect } from 'react';
import { Lock, LayoutDashboard, Calendar, MessageSquare, DollarSign, RefreshCw, Settings as SettingsIcon } from 'lucide-react';
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
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      setIsUnlocked(true);
    }
  }, []);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        if (AuthService.login(newPin, false)) {
          setIsUnlocked(true);
          setError(false);
        } else {
          setError(true);
          setShake(true);
          
          setTimeout(() => {
            setShake(false);
            setPin('');
            setError(false);
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
        <style>
          {`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
              20%, 40%, 60%, 80% { transform: translateX(10px); }
            }
            .shake { animation: shake 0.6s; }
          `}
        </style>
        
        <div className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md ${shake ? 'shake' : ''}`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Lock size={40} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gîte Master v2.0</h1>
            <p className="text-gray-600">Entrez votre code PIN</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-700 text-sm font-medium">❌ Code PIN incorrect</p>
            </div>
          )}

          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all ${
                  error 
                    ? 'border-red-500 bg-red-50' 
                    : pin.length > i 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-300 bg-white'
                }`}
              >
                {pin.length > i && (
                  <div className={`w-4 h-4 rounded-full ${error ? 'bg-red-500' : 'bg-blue-600'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                disabled={shake}
                className="h-16 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl font-bold text-2xl text-gray-900 transition-colors disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleBackspace}
              disabled={shake}
              className="h-16 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl text-gray-700 transition-colors text-2xl disabled:opacity-50"
            >
              ←
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              disabled={shake}
              className="h-16 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl font-bold text-2xl text-gray-900 transition-colors disabled:opacity-50"
            >
              0
            </button>
            <button className="h-16 bg-blue-600 text-white rounded-xl transition-colors text-2xl" disabled={shake}>
              ✓
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              PIN par défaut : <span className="font-mono font-bold">1234</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Modifiable dans Administration → Sécurité
            </p>
          </div>
        </div>
      </div>
    );
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
