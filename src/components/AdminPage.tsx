import React, { useState, useEffect } from 'react';
import { Settings, Home, Star, Send, Shield, User } from 'lucide-react';
import ConfigService from '../services/ConfigService';
import DataService from '../services/DataService';
import PropertyManager from './PropertyManager';

type TabType = 'general' | 'properties' | 'reviews' | 'api' | 'security';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Reviews
  const [reviewLinks, setReviewLinks] = useState({ google: '', airbnb: '', booking: '' });

  // API Config
  const [apiConfig, setApiConfig] = useState({
    brevoApiKey: '',
    brevoSenderEmail: '',
    brevoSenderName: '',
    supabaseUrl: '',
    supabaseAnonKey: ''
  });

  useEffect(() => {
    loadSettings();
    const links = DataService.getReviewLinks();
    setReviewLinks(links);

    // Load API config from localStorage
    const savedBrevoKey = localStorage.getItem('brevo_api_key') || '';
    const savedBrevoEmail = localStorage.getItem('brevo_sender_email') || '';
    const savedBrevoName = localStorage.getItem('brevo_sender_name') || '';
    const savedSupabaseUrl = localStorage.getItem('supabase_url') || '';
    const savedSupabaseKey = localStorage.getItem('supabase_anon_key') || '';

    setApiConfig({
      brevoApiKey: savedBrevoKey,
      brevoSenderEmail: savedBrevoEmail,
      brevoSenderName: savedBrevoName,
      supabaseUrl: savedSupabaseUrl,
      supabaseAnonKey: savedSupabaseKey
    });
  }, []);

  const loadSettings = async () => {
    const loaded = await ConfigService.loadSettings();
    setSettings(loaded);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Save review links
      DataService.saveReviewLinks(reviewLinks);

      // Save API config to localStorage
      localStorage.setItem('brevo_api_key', apiConfig.brevoApiKey);
      localStorage.setItem('brevo_sender_email', apiConfig.brevoSenderEmail);
      localStorage.setItem('brevo_sender_name', apiConfig.brevoSenderName);
      localStorage.setItem('supabase_url', apiConfig.supabaseUrl);
      localStorage.setItem('supabase_anon_key', apiConfig.supabaseAnonKey);

      // Save settings
      await ConfigService.saveSettings(settings);

      setSaveMessage({ type: 'success', text: '✅ Paramètres enregistrés avec succès !' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: '❌ Erreur lors de l\'enregistrement' });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = (path: string, value: any) => {
    const keys = path.split('.');
    const updated = { ...settings };
    let current: any = updated;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    setSettings(updated);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPin !== confirmPin) {
      alert('❌ Les codes PIN ne correspondent pas');
      return;
    }

    const currentStoredPin = localStorage.getItem('admin_pin');
    if (currentStoredPin && currentPin !== currentStoredPin) {
      alert('❌ Code PIN actuel incorrect');
      return;
    }

    localStorage.setItem('admin_pin', newPin);
    alert('✅ Code PIN mis à jour avec succès');
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.reload();
  };

  if (!settings) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'properties', label: 'Propriétés', icon: Home },
    { id: 'reviews', label: 'Liens Avis', icon: Star },
    { id: 'api', label: 'API & Envois', icon: Send },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
              <p className="text-gray-600 mt-1">Gérez les paramètres de votre application</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {saveMessage && (
            <div className={`mt-4 p-4 rounded-lg ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {saveMessage.text}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Informations Générales</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'établissement</label>
                      <input
                        type="text"
                        value={settings.general?.name || ''}
                        onChange={(e) => updateSettings('general.name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Elysia Nature & Spa"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
                      <input
                        type="email"
                        value={settings.general?.email || ''}
                        onChange={(e) => updateSettings('general.email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="contact@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={settings.general?.phone || ''}
                        onChange={(e) => updateSettings('general.phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Properties Tab */}
            {activeTab === 'properties' && (
              <PropertyManager />
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Star className="text-yellow-600" />
                    Liens vers vos pages d'avis
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Configurez les liens vers vos pages d'avis pour faciliter les demandes de retours clients.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Google My Business</label>
                      <input
                        type="url"
                        value={reviewLinks.google}
                        onChange={(e) => setReviewLinks({ ...reviewLinks, google: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://g.page/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Airbnb</label>
                      <input
                        type="url"
                        value={reviewLinks.airbnb}
                        onChange={(e) => setReviewLinks({ ...reviewLinks, airbnb: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://www.airbnb.fr/rooms/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Booking.com</label>
                      <input
                        type="url"
                        value={reviewLinks.booking}
                        onChange={(e) => setReviewLinks({ ...reviewLinks, booking: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://www.booking.com/hotel/..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Tab */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Configuration Brevo (anciennement Sendinblue)</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Clé API Brevo</label>
                      <input
                        type="password"
                        value={apiConfig.brevoApiKey}
                        onChange={(e) => setApiConfig({ ...apiConfig, brevoApiKey: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="xkeysib-..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email expéditeur</label>
                      <input
                        type="email"
                        value={apiConfig.brevoSenderEmail}
                        onChange={(e) => setApiConfig({ ...apiConfig, brevoSenderEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="contact@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom expéditeur</label>
                      <input
                        type="text"
                        value={apiConfig.brevoSenderName}
                        onChange={(e) => setApiConfig({ ...apiConfig, brevoSenderName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Elysia Nature & Spa"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Configuration Supabase</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL Supabase</label>
                      <input
                        type="url"
                        value={apiConfig.supabaseUrl}
                        onChange={(e) => setApiConfig({ ...apiConfig, supabaseUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://xxx.supabase.co"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Clé anonyme (anon key)</label>
                      <input
                        type="password"
                        value={apiConfig.supabaseAnonKey}
                        onChange={(e) => setApiConfig({ ...apiConfig, supabaseAnonKey: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="text-blue-600" />
                    Code PIN Administrateur
                  </h2>
                  
                  <form onSubmit={handleUpdatePin} className="space-y-4 max-w-md">
                    {localStorage.getItem('admin_pin') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Code PIN actuel</label>
                        <input
                          type="password"
                          value={currentPin}
                          onChange={(e) => setCurrentPin(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau code PIN</label>
                      <input
                        type="password"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        minLength={4}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le code PIN</label>
                      <input
                        type="password"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        minLength={4}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Mettre à jour le code PIN
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
