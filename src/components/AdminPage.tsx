import React, { useState, useEffect } from 'react';
import { Settings, Save, Home, DollarSign, Mail, Palette, Shield, Check, AlertCircle, Star, Link as LinkIcon, Key, Send } from 'lucide-react';
import ConfigService from '../services/ConfigService';
import AuthService from '../services/AuthService';
import DataService from '../services/DataService';
import EmailService from '../services/EmailService';
import SMSService from '../services/SMSService';
import PropertyManager from './PropertyManager';

type TabType = 'general' | 'properties' | 'pricing' | 'reviews' | 'api' | 'security';

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

  // API tab
  const [apiConfig, setApiConfig] = useState({
    sendgridKey: '',
    fromEmail: '',
    fromName: '',
    twilioSid: '',
    twilioToken: '',
    twilioPhone: ''
  });

  useEffect(() => {
    loadSettings();
    const links = DataService.getReviewLinks();
    setReviewLinks(links);
    
    // Charger config API
    setApiConfig({
      sendgridKey: localStorage.getItem('sendgrid_api_key') || '',
      fromEmail: localStorage.getItem('from_email') || '',
      fromName: localStorage.getItem('from_name') || '',
      twilioSid: localStorage.getItem('twilio_account_sid') || '',
      twilioToken: localStorage.getItem('twilio_auth_token') || '',
      twilioPhone: localStorage.getItem('twilio_from_phone') || ''
    });
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
      
      // Sauvegarder config API
      EmailService.setApiKey(apiConfig.sendgridKey);
      EmailService.setFromEmail(apiConfig.fromEmail, apiConfig.fromName);
      SMSService.setCredentials(apiConfig.twilioSid, apiConfig.twilioToken, apiConfig.twilioPhone);
      
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
    { id: 'api', label: 'API & Envois', icon: Send },
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
          <PropertyManager />
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

        {/* API Tab */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            {/* SendGrid */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Mail className="text-blue-600" />
                SendGrid - Emails automatiques
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Configurez SendGrid pour envoyer des emails automatiques. <a href="https://sendgrid.com" target="_blank" className="text-blue-600 hover:underline">Créer un compte gratuit →</a>
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Key size={16} />
                    API Key SendGrid
                  </label>
                  <input
                    type="password"
                    value={apiConfig.sendgridKey}
                    onChange={(e) => setApiConfig({ ...apiConfig, sendgridKey: e.target.value })}
                    placeholder="SG.xxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    SendGrid → Settings → API Keys → Create API Key
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email expéditeur</label>
                    <input
                      type="email"
                      value={apiConfig.fromEmail}
                      onChange={(e) => setApiConfig({ ...apiConfig, fromEmail: e.target.value })}
                      placeholder="noreply@votregite.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom expéditeur</label>
                    <input
                      type="text"
                      value={apiConfig.fromName}
                      onChange={(e) => setApiConfig({ ...apiConfig, fromName: e.target.value })}
                      placeholder="Villa Exemple"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="font-medium text-blue-900">💡 Plan gratuit SendGrid :</p>
                  <p className="text-blue-800 mt-1">100 emails/jour gratuitement - Parfait pour débuter !</p>
                </div>

                <div className={`p-3 rounded-lg flex items-center gap-2 ${
                  EmailService.isConfigured() ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
                }`}>
                  {EmailService.isConfigured() ? (
                    <>
                      <CheckCircle size={18} />
                      <span className="font-medium">✅ SendGrid configuré</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} />
                      <span className="font-medium">⚠️ SendGrid non configuré (mode simulation)</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Twilio */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Send className="text-green-600" />
                Twilio - SMS automatiques (Optionnel)
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Configurez Twilio pour envoyer des SMS. <a href="https://twilio.com" target="_blank" className="text-blue-600 hover:underline">Créer un compte →</a>
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account SID</label>
                  <input
                    type="password"
                    value={apiConfig.twilioSid}
                    onChange={(e) => setApiConfig({ ...apiConfig, twilioSid: e.target.value })}
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auth Token</label>
                  <input
                    type="password"
                    value={apiConfig.twilioToken}
                    onChange={(e) => setApiConfig({ ...apiConfig, twilioToken: e.target.value })}
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numéro Twilio</label>
                  <input
                    type="tel"
                    value={apiConfig.twilioPhone}
                    onChange={(e) => setApiConfig({ ...apiConfig, twilioPhone: e.target.value })}
                    placeholder="+33xxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format international (ex: +33612345678)
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="font-medium text-blue-900">💡 Crédit gratuit Twilio :</p>
                  <p className="text-blue-800 mt-1">10€ offerts à l'inscription (~200 SMS)</p>
                  <p className="text-blue-800">Ensuite ~0,05€/SMS</p>
                </div>

                <div className={`p-3 rounded-lg flex items-center gap-2 ${
                  SMSService.isConfigured() ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
                }`}>
                  {SMSService.isConfigured() ? (
                    <>
                      <CheckCircle size={18} />
                      <span className="font-medium">✅ Twilio configuré</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} />
                      <span className="font-medium">ℹ️ Twilio non configuré (optionnel)</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="font-bold text-purple-900 mb-3">🚀 Fonctionnement des envois automatiques</h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>✅ <strong>Sans configuration :</strong> Mode simulation (console.log)</li>
                <li>✅ <strong>SendGrid configuré :</strong> Emails envoyés automatiquement</li>
                <li>✅ <strong>Twilio configuré :</strong> SMS envoyés automatiquement</li>
                <li>✅ <strong>Déclencheurs :</strong> Réservation, J-3, J-0, J+1</li>
              </ul>
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
