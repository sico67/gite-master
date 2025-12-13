import { useState } from 'react';
import {
  Home,
  Settings,
  BookOpen,
  Calendar,
  Image,
  FileText,
  Users
} from 'lucide-react';

import PropertyManager from './PropertyManager';
import WelcomeGuideModule from './WelcomeGuideModule';
import CalendarModule from './CalendarModule';
import MediaModule from './MediaModule';
import DocumentsModule from './DocumentsModule';
import GuestsModule from './GuestsModule';

export type TabType =
  | 'properties'
  | 'welcome'
  | 'calendar'
  | 'media'
  | 'documents'
  | 'guests';

const tabs = [
  { id: 'properties', label: 'Biens', icon: Home },
  { id: 'welcome', label: 'Livret d’accueil', icon: BookOpen },
  { id: 'calendar', label: 'Calendrier', icon: Calendar },
  { id: 'media', label: 'Médias', icon: Image },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'guests', label: 'Voyageurs', icon: Users }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('properties');

  const renderContent = () => {
    switch (activeTab) {
      case 'properties':
        return <PropertyManager />;
      case 'welcome':
        return <WelcomeGuideModule />;
      case 'calendar':
        return <CalendarModule />;
      case 'media':
        return <MediaModule />;
      case 'documents':
        return <DocumentsModule />;
      case 'guests':
        return <GuestsModule />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6 font-bold text-xl border-b">
          Admin
        </div>

        <nav className="p-2 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition
                  ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
