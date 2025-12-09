import React, { useState, useEffect } from 'react';
import { Settings, Save, Home, DollarSign, Mail, Palette, Shield, Check, AlertCircle, Star, Link as LinkIcon } from 'lucide-react';
import ConfigService from '../services/ConfigService';
import AuthService from '../services/AuthService';
import DataService from '../services/DataService';

type TabType = 'general' | 'properties' | 'pricing' | 'reviews' | 'security';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Security tab
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Reviews tab
  const [reviewLinks, setReviewLinks] = useState({ google: '', airbnb: '', booking: '' });

  useEffect(() => {
    loadSettings();
    const links = DataService.getReviewLinks();
    setReviewLinks(links);
  }, []);

  const loadSettings = async () => {
    const loaded = await ConfigService.loadSettings();
    setSettings(loaded);
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await ConfigService.saveSettings(settings);
      DataService.saveReviewLinks(reviewLinks);
      setSaveMessage({ type: 'success', text: 'Paramètres sauvegardés !' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = (path: string, value: any) => {
    if (!settings) return;
    const keys = path.split('.');
    const updated = { ...settings };
    let current: any = updated;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setSettings(updated);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!AuthService.verifyPin(currentPin)) {
      setSaveMessage({ type: 'error', text: 'Code PIN actuel incorrect' });
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setSaveMessage({ type: 'error', text: 'Le nouveau PIN doit contenir 4 chiffres' });
      return;
    }

    if (newPin !== confirmPin) {
      setSaveMessage({ type: 'error', text: 'Les codes PIN ne correspondent pas' });
      return;
    }

    try {
      AuthService.updatePin(newPin);
      setSaveMessage({ type: 'success', text: '✅ Code PIN modifié avec succès !' });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Erreur lors de la modification du PIN' });
    }
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      AuthService.logout();
      window.location.reload();
    }
  };

  if (!settings) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'properties', label: 'Propriétés', icon: Home },
    { id: 'pricing', label: 'Tarification', icon: DollarSign },
    { id: 'reviews', label: 'Liens Avis', icon: Star },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ];

  const colors = [
    { name: 'Bleu', value: 'blue', class: 'bg-blue-600' },
    { name: 'Vert', value: 'green', class: 'bg-green-600' },
    { name: 'Violet', value: 'purple', class: 'bg-purple-600' },
    { name: 'Rouge', value: 'red', class: 'bg-red-600' },
    { name: 'Indigo', value: 'indigo', class: 'bg-indigo-600' },
    { name: 'Turquoise', value: 'teal', class: 'bg-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Settings className="text-blue-600" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Sauvegarde...' : <><Save size={18} /> Enregistrer</>}
            </button>
          </div>
          
          {saveMessage && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {saveMessage.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
              <span>{saveMessage.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations Générales</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'application</label>
                <input
                  type="text"
                  value={settings.general.appName}
                  onChange={(e) => updateSettings('general.appName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
                <input
                  type="email"
                  value={settings.general.email}
                  onChange={(e) => updateSettings('general.email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={settings.general.phone}
                  onChange={(e) => updateSettings('general.phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Couleur principale</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {colors.map(color => (
                    <button
                      key={color.value}
                      onClick={() => updateSettings('general.primaryColor', color.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.general.primaryColor === color.value
                          ? 'border-gray-900 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-12 rounded ${color.class} mb-2`} />
                      <p className="text-sm font-medium text-center">{color.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mes Propriétés</h2>
            
            <div className="space-y-4">
              {settings.properties.map((property: any) => (
                <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <input
                        type="text"
                        value={property.name}
                        onChange={(e) => {
                          const updated = settings.properties.map((p: any) =>
                            p.id === property.id ? { ...p, name: e.target.value } : p
                          );
                          updateSettings('properties', updated);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                      <input
                        type="text"
                        value={property.city}
                        onChange={(e) => {
                          const updated = settings.properties.map((p: any) =>
                            p.id === property.id ? { ...p, city: e.target.value } : p
                          );
                          updateSettings('properties', updated);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prix (€/nuit)</label>
                      <input
                        type="number"
                        value={property.price}
                        onChange={(e) => {
                          const updated = settings.properties.map((p: any) =>
                            p.id === property.id ? { ...p, price: Number(e.target.value) } : p
                          );
                          updateSettings('properties', updated);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Capacité</label>
                      <input
                        type="number"
                        value={property.capacity}
                        onChange={(e) => {
                          const updated = settings.properties.map((p: any) =>
                            p.id === property.id ? { ...p, capacity: Number(e.target.value) } : p
                          );
                          updateSettings('properties', updated);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Configuration des Tarifs</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix par défaut (€/nuit)</label>
                <input
                  type="number"
                  value={settings.pricing.defaultRate}
                  onChange={(e) => updateSettings('pricing.defaultRate', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frais de ménage (€)</label>
                <input
                  type="number"
                  value={settings.pricing.cleaningFee}
                  onChange={(e) => updateSettings('pricing.cleaningFee', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caution (€)</label>
                <input
                  type="number"
                  value={settings.pricing.deposit}
                  onChange={(e) => updateSettings('pricing.deposit', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée minimum (nuits)</label>
                <input
                  type="number"
                  value={settings.pricing.minimumStay}
                  onChange={(e) => updateSettings('pricing.minimumStay', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
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
                Configurez les liens vers vos pages d'avis pour les intégrer automatiquement dans vos messages aux clients.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <LinkIcon size={16} />
                    Lien Google Reviews
                  </label>
                  <input
                    type="url"
                    value={reviewLinks.google}
                    onChange={(e) => setReviewLinks({ ...reviewLinks, google: e.target.value })}
                    placeholder="https://g.page/r/YOUR_PLACE_ID/review"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: https://g.page/r/[YOUR_PLACE_ID]/review
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <LinkIcon size={16} />
                    Lien Airbnb Reviews
                  </label>
                  <input
                    type="url"
                    value={reviewLinks.airbnb}
                    onChange={(e) => setReviewLinks({ ...reviewLinks, airbnb: e.target.value })}
                    placeholder="https://airbnb.com/rooms/YOUR_LISTING_ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: https://airbnb.com/rooms/[YOUR_LISTING_ID]
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <LinkIcon size={16} />
                    Lien Booking.com Reviews
                  </label>
                  <input
                    type="url"
                    value={reviewLinks.booking}
                    onChange={(e) => setReviewLinks({ ...reviewLinks, booking: e.target.value })}
                    placeholder="https://booking.com/hotel/YOUR_PROPERTY.html"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: https://booking.com/hotel/[YOUR_PROPERTY].html
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Comment trouver vos liens ?</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li><strong>Google:</strong> Google Business Profile → Partager → Copier le lien</li>
                  <li><strong>Airbnb:</strong> Votre annonce → Copier le lien de la page</li>
                  <li><strong>Booking:</strong> Extranet → Votre établissement → Lien public</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Modifier le code PIN</h2>
              
              <form onSubmit={handleUpdatePin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code PIN actuel</label>
                  <input
                    type="password"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    placeholder="••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-2xl text-center"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau code PIN (4 chiffres)</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    placeholder="••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-2xl text-center"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau PIN</label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    placeholder="••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-2xl text-center"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <Shield size={18} />
                  Modifier le code PIN
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">🚪 Déconnexion</h3>
              <p className="text-sm text-gray-600 mb-4">
                Se déconnecter vous redirigera vers l'écran de verrouillage.
              </p>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;
