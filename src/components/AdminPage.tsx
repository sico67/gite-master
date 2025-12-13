import React, { useState } from 'react';
import { Home, Plus, Edit, Copy, Trash2, Eye, EyeOff, Save, X, Upload } from 'lucide-react';
import PropertyManager from './PropertyManager';

// Définition des onglets
type TabType = 'dashboard' | 'properties' | 'media' | 'documents' | 'guests';

const tabs: { id: TabType; label: string; icon: React.FC<any> }[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: Home },
  { id: 'properties', label: 'Propriétés', icon: Plus },
  { id: 'media', label: 'Médias', icon: Upload },
  { id: 'documents', label: 'Documents', icon: Save },
  { id: 'guests', label: 'Invités', icon: Edit },
];

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div>Bienvenue sur le tableau de bord</div>;
      case 'properties':
        return <PropertyManager />;
      case 'media':
        return <div>Module Media (placeholder)</div>;
      case 'documents':
        return <div>Module Documents (placeholder)</div>;
      case 'guests':
        return <div>Module Guests (placeholder)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar verticale */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6 font-bold text-xl border-b">Administration</div>
        <nav className="p-2 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition
                  ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
};

export default AdminPage;
