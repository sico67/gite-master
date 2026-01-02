
import React, { useState } from 'react';
import { Home, Calendar, Wrench, Package, Menu, X, LogOut, Brush, RefreshCw, BookOpen, ArrowLeft, MessageSquare, DollarSign } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: Home },
    { name: 'Calendrier', id: 'calendar', icon: Calendar },
    { name: 'Messagerie', id: 'messages', icon: MessageSquare }, 
    { name: 'Opérations', id: 'operations', icon: Package }, 
    { name: 'Finance', id: 'finance', icon: DollarSign }, // Nouveau Module
    { name: 'Synchronisation', id: 'channels', icon: RefreshCw },
    { name: 'Ménage (Admin)', id: 'cleaning', icon: Brush }, 
  ];

  const currentModule = navigation.find(n => n.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm flex-shrink-0 z-50 flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Gîte Master</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-800 bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <nav 
            className="absolute top-[60px] left-0 w-full bg-white shadow-lg p-4 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <item.icon size={20} className="mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
             <div className="border-t pt-2 mt-2 space-y-2">
                <button 
                  onClick={() => {
                     window.location.hash = '#cleaning-report';
                     setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-purple-600 font-bold bg-purple-50 rounded-lg text-sm"
                >
                    <Brush size={18} className="mr-3" />
                    Vue Nettoyeur
                </button>
                <button 
                  onClick={() => {
                     window.location.hash = '#guest-guide';
                     setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-green-600 font-bold bg-green-50 rounded-lg text-sm"
                >
                    <BookOpen size={18} className="mr-3" />
                    Livret Voyageur
                </button>
             </div>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 h-full flex-shrink-0">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">Gîte Master</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} className="mr-3" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-2 bg-gray-50">
            <button 
                onClick={() => window.location.hash = '#guest-guide'}
                className="flex items-center justify-center w-full px-4 py-2 text-sm text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
            >
                <BookOpen size={16} className="mr-2" />
                Livret Voyageur
            </button>
             <button 
                onClick={() => window.location.hash = '#cleaning-report'}
                className="flex items-center justify-center w-full px-4 py-2 text-sm text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
            >
                <Brush size={16} className="mr-2" />
                Vue Nettoyeur
            </button>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mt-2"
          >
            <LogOut size={16} className="mr-2" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-gray-50 h-full relative overflow-hidden">
        
        {/* GLOBAL NAVIGATION BAR (Only shows when NOT on Dashboard) */}
        {activeTab !== 'dashboard' && (
            <div className="bg-gray-900 text-white px-4 py-3 shadow-md flex-shrink-0 flex items-center justify-between z-30">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gray-700 rounded-lg">
                        {currentModule?.icon && <currentModule.icon size={20} className="text-blue-400" />}
                    </div>
                    <span className="font-bold text-lg">{currentModule?.name}</span>
                </div>
                <button 
                    onClick={() => onTabChange('dashboard')}
                    className="flex items-center gap-2 bg-white text-gray-900 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm"
                >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Tableau de Bord</span>
                    <span className="sm:hidden">Retour</span>
                </button>
            </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
