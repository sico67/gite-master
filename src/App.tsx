import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CalendarModule from './components/CalendarModule';
import MessagingModule from './components/MessagingModule';
import OperationsModule from './components/OperationsModule';
import AccountingModule from './components/AccountingModule';
import ChannelManager from './components/ChannelManager';
import { HousekeepingDashboard as HousekeepingModule } from './components/HousekeepingModule';
import { PublicBookingEngine } from './components/PublicBookingEngine';
import { GuestGuide } from './components/GuestGuide';
import { CleaningReport } from './components/CleaningReport';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Gestion des vues externes (Site public, Guide voyageur, Rapport ménage)
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#booking') {
      setActiveTab('public-booking');
    } else if (hash === '#guest-guide') {
      setActiveTab('guest-guide');
    } else if (hash === '#cleaning-report') {
      setActiveTab('cleaning-report');
    }
  }, []);

  const handleNavigate = (view: string, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
    setActiveTab(view);
  };

  // Vues spéciales (sans Layout)
  if (activeTab === 'public-booking') {
    return <PublicBookingEngine onExit={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'guest-guide') {
    return <GuestGuide onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'cleaning-report') {
    return <CleaningReport onBack={() => setActiveTab('dashboard')} />;
  }

  // Vue principale avec Layout
  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
      {activeTab === 'calendar' && <CalendarModule selectedDate={selectedDate} />}
      {activeTab === 'messages' && <MessagingModule />}
      {activeTab === 'operations' && <OperationsModule />}
      {activeTab === 'finance' && <AccountingModule />}
      {activeTab === 'channels' && <ChannelManager />}
      {activeTab === 'cleaning' && <HousekeepingModule />}
    </Layout>
  );
}

export default App;
