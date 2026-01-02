
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CalendarModule from './components/CalendarModule';
import OperationsModule from './components/OperationsModule';
import ChannelManager from './components/ChannelManager';
import MessagingModule from './components/MessagingModule';
import AccountingModule from './components/AccountingModule'; // Nouveau Module
import { HousekeepingDashboard, CleaningReportForm } from './components/HousekeepingModule';
import { GuestGuide } from './components/GuestGuide';
import { PublicBookingEngine } from './components/PublicBookingEngine';
import Login from './components/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('dashboard');
  const [calendarTargetDate, setCalendarTargetDate] = useState<Date | null>(null);
  
  // Public Modes (No Login Required)
  const [publicMode, setPublicMode] = useState<'cleaning' | 'guide' | 'booking' | null>(null);

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#cleaning-report') {
        setPublicMode('cleaning');
      } else if (hash === '#guest-guide') {
        setPublicMode('guide');
      } else if (hash === '#booking') {
        setPublicMode('booking');
      } else {
        setPublicMode(null);
      }
    };
    
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleNavigate = (targetView: string, date?: Date) => {
      if (date) {
          setCalendarTargetDate(date);
      }
      setView(targetView);
  };

  const handleBack = () => {
      setView('dashboard');
  };

  // --- PUBLIC ROUTES (No Auth) ---
  if (publicMode === 'cleaning') {
    return <CleaningReportForm onComplete={() => window.location.hash = ''} />;
  }
  if (publicMode === 'guide') {
    return <GuestGuide onExit={() => window.location.hash = ''} />;
  }
  if (publicMode === 'booking') {
    return <PublicBookingEngine onExit={() => window.location.hash = ''} />;
  }

  // --- AUTHENTICATION ---
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  // --- PROTECTED ADMIN APP ---
  return (
    <Layout activeTab={view} onTabChange={setView}>
      {view === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
      {view === 'calendar' && <CalendarModule targetDate={calendarTargetDate} onBack={handleBack} />}
      {view === 'messages' && <MessagingModule onBack={handleBack} />}
      {view === 'operations' && <OperationsModule onBack={handleBack} />}
      {view === 'finance' && <AccountingModule onBack={handleBack} />}
      {view === 'channels' && <ChannelManager onBack={handleBack} />}
      {view === 'cleaning' && <HousekeepingDashboard onBack={handleBack} />}
    </Layout>
  );
}
