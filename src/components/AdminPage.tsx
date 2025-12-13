import React, { useState, useEffect } from 'react';
import { Settings, Save, Home, DollarSign, Mail, Palette, Shield, Check, AlertCircle, Star, Link as LinkIcon, Key, Send, Database, CreditCard, Cloud, Brain, CheckCircle, ExternalLink, Copy } from 'lucide-react';
import ConfigService from '../services/ConfigService';
import AuthService from '../services/AuthService';
import DataService from '../services/DataService';
import EmailService from '../services/EmailService';
import SMSService from '../services/SMSService';
import StorageManager from '../services/StorageManager';
import SupabaseService from '../services/SupabaseService';
import StripeService from '../services/StripeService';
import AIService from '../services/AIService';
import PropertyManager from './PropertyManager';
import CleaningChecklistManager from './CleaningChecklistManager';

type TabType = 'general' | 'properties' | 'pricing' | 'reviews' | 'cleaning' | 'api' | 'integrations' | 'security' | 'data';

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
    { id: 'cleaning', label: 'Ménage', icon: CheckCircle },
    { id: 'api', label: 'API & Envois', icon: Send },
    { id: 'integrations', label: 'Intégrations', icon: Cloud },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'data', label: 'Données', icon: Database },
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar gauche */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          {/* Logo/Title */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Settings className="text-blue-600" size={24} />
              <h1 className="text-lg font-bold text-gray-900">Admin</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3">
            <div className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={isActive 
                      ? 'w-full px-4 py-3 flex items-center gap-3 rounded-lg transition-all text-left bg-blue-600 text-white shadow-md'
                      : 'w-full px-4 py-3 flex items-center gap-3 rounded-lg transition-all text-left text-gray-700 hover:bg-gray-100'
                    }
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.label || 'Paramètres'}
            </h2>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Sauvegarde...' : <><Save size={18} /> Enregistrer</>}
            </button>
          </div>
          
          {saveMessage && (
            <div className={
              saveMessage.type === 'success' 
                ? 'mx-8 mb-4 p-3 rounded-lg flex items-center gap-2 bg-green-50 text-green-800'
                : 'mx-8 mb-4 p-3 rounded-lg flex items-center gap-2 bg-red-50 text-red-800'
            }>
              {saveMessage.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
              <span>{saveMessage.text}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
        
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

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            
            {/* Supabase */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Database className="text-green-600" />
                Supabase - Base de données cloud
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Stockez vos données dans le cloud avec Supabase (PostgreSQL). 
                <a href="https://supabase.com" target="_blank" className="text-blue-600 hover:underline ml-1">
                  Créer un compte gratuit →
                </a>
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL du projet
                  </label>
                  <input
                    type="text"
                    placeholder="https://xxxxxxxxxxx.supabase.co"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
                    onChange={(e) => {
                      const url = e.target.value;
                      localStorage.setItem('supabase_url', url);
                    }}
                    defaultValue={localStorage.getItem('supabase_url') || ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Trouvez votre URL dans Settings → API → Project URL
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anon Key (public)
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
                    onChange={(e) => {
                      const key = e.target.value;
                      localStorage.setItem('supabase_anon_key', key);
                    }}
                    defaultValue={localStorage.getItem('supabase_anon_key') || ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Trouvez votre clé dans Settings → API → anon public
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      const url = localStorage.getItem('supabase_url');
                      const key = localStorage.getItem('supabase_anon_key');
                      
                      if (!url || !key) {
                        alert('❌ Veuillez remplir URL et Anon Key');
                        return;
                      }

                      const success = SupabaseService.configure({ url, anonKey: key });
                      
                      if (success) {
                        const test = await SupabaseService.testConnection();
                        alert(test.message);
                      } else {
                        alert('❌ Erreur de configuration');
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Tester la connexion
                  </button>

                  <button
                    onClick={async () => {
                      if (!confirm('Migrer toutes les données de localStorage vers Supabase ?')) {
                        return;
                      }

                      const result = await SupabaseService.migrateFromLocalStorage();
                      
                      if (result.success) {
                        alert(`✅ Migration réussie ! ${result.migrated} items migrés.`);
                      } else {
                        alert(`❌ Erreur: ${result.error}`);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Migrer depuis localStorage
                  </button>
                </div>

                <div className={`p-4 rounded-lg ${
                  SupabaseService.isReady() 
                    ? 'bg-green-50 border-2 border-green-200' 
                    : 'bg-yellow-50 border-2 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-2 text-sm">
                    {SupabaseService.isReady() ? (
                      <>
                        <Check size={18} className="text-green-600" />
                        <span className="font-medium text-green-800">✅ Supabase configuré</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={18} className="text-yellow-600" />
                        <span className="font-medium text-yellow-800">⚠️ Supabase non configuré (mode localStorage)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2">📋 Setup Supabase</h4>
                  <ol className="space-y-1 text-xs text-blue-800">
                    <li>1. Créer projet sur supabase.com</li>
                    <li>2. Créer tables: bookings, properties, cleaning_tasks</li>
                    <li>3. Copier URL + anon key ici</li>
                    <li>4. Tester connexion</li>
                    <li>5. Migrer données localStorage</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Stripe */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <CreditCard className="text-purple-600" />
                Stripe - Paiements & Cautions
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Acceptez les paiements et gérez les cautions avec Stripe. 
                <a href="https://stripe.com" target="_blank" className="text-blue-600 hover:underline ml-1">
                  Créer un compte →
                </a>
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publishable Key (public)
                  </label>
                  <input
                    type="text"
                    placeholder="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                    onChange={(e) => {
                      const key = e.target.value;
                      localStorage.setItem('stripe_publishable_key', key);
                    }}
                    defaultValue={localStorage.getItem('stripe_publishable_key') || ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Trouvez votre clé dans Dashboard → Developers → API keys
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      const key = localStorage.getItem('stripe_publishable_key');
                      
                      if (!key) {
                        alert('❌ Veuillez remplir la Publishable Key');
                        return;
                      }

                      const success = await StripeService.configure({ publishableKey: key });
                      
                      if (success) {
                        const test = await StripeService.testConnection();
                        alert(test.message);
                      } else {
                        alert('❌ Erreur de configuration');
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Tester la connexion
                  </button>

                  <button
                    onClick={() => {
                      const cards = StripeService.getTestCards();
                      const cardsList = cards.map(c => 
                        `${c.type}: ${c.number}\nCVC: ${c.cvc} | Exp: ${c.exp}\nRésultat: ${c.result}`
                      ).join('\n\n');
                      
                      alert(`💳 CARTES TEST STRIPE\n\n${cardsList}\n\nUtilisez ces cartes en mode test pour tester les paiements.`);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Voir cartes test
                  </button>
                </div>

                <div className={`p-4 rounded-lg ${
                  StripeService.isReady() 
                    ? 'bg-purple-50 border-2 border-purple-200' 
                    : 'bg-yellow-50 border-2 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-2 text-sm">
                    {StripeService.isReady() ? (
                      <>
                        <Check size={18} className="text-purple-600" />
                        <span className="font-medium text-purple-800">✅ Stripe configuré</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={18} className="text-yellow-600" />
                        <span className="font-medium text-yellow-800">⚠️ Stripe non configuré (paiements simulés)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-2">💳 Setup Stripe</h4>
                  <ol className="space-y-1 text-xs text-purple-800">
                    <li>1. Créer compte sur stripe.com</li>
                    <li>2. Activer mode test</li>
                    <li>3. Copier Publishable Key (pk_test_...)</li>
                    <li>4. Configurer webhook (optionnel)</li>
                    <li>5. Tester avec cartes test</li>
                  </ol>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border-2 border-green-200">
                  <h4 className="font-bold text-green-900 mb-2">🎯 Fonctionnalités disponibles</h4>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li>✅ Paiements one-time (réservations)</li>
                    <li>✅ Cautions (hold + release/capture)</li>
                    <li>✅ Paiements complémentaires</li>
                    <li>✅ Liens de paiement</li>
                    <li>✅ Webhooks événements</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Service */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Brain className="text-pink-600" />
                Intelligence Artificielle - Assistant IA
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Activez l'IA réelle avec OpenAI (GPT-4) ou Anthropic (Claude). 
                <a href="https://platform.openai.com" target="_blank" className="text-blue-600 hover:underline ml-1">
                  OpenAI →
                </a> | 
                <a href="https://console.anthropic.com" target="_blank" className="text-blue-600 hover:underline ml-1">
                  Anthropic →
                </a>
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    onChange={(e) => {
                      const provider = e.target.value as 'openai' | 'anthropic';
                      localStorage.setItem('ai_provider', provider);
                    }}
                    defaultValue={localStorage.getItem('ai_provider') || 'openai'}
                  >
                    <option value="openai">OpenAI (GPT-4, GPT-3.5)</option>
                    <option value="anthropic">Anthropic (Claude 3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    placeholder="sk-... ou sk-ant-..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 font-mono text-sm"
                    onChange={(e) => {
                      const key = e.target.value;
                      localStorage.setItem('ai_api_key', key);
                    }}
                    defaultValue={localStorage.getItem('ai_api_key') || ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    OpenAI: Dashboard → API keys | Anthropic: Console → API keys
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modèle
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    onChange={(e) => {
                      const model = e.target.value;
                      localStorage.setItem('ai_model', model);
                    }}
                    defaultValue={localStorage.getItem('ai_model') || 'gpt-4'}
                  >
                    <optgroup label="OpenAI">
                      <option value="gpt-4">GPT-4 (le plus puissant)</option>
                      <option value="gpt-4-turbo-preview">GPT-4 Turbo (rapide)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (économique)</option>
                    </optgroup>
                    <optgroup label="Anthropic">
                      <option value="claude-3-opus-20240229">Claude 3 Opus (intelligent)</option>
                      <option value="claude-3-sonnet-20240229">Claude 3 Sonnet (équilibré)</option>
                      <option value="claude-3-haiku-20240307">Claude 3 Haiku (rapide)</option>
                    </optgroup>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      const provider = localStorage.getItem('ai_provider') as 'openai' | 'anthropic';
                      const apiKey = localStorage.getItem('ai_api_key');
                      const model = localStorage.getItem('ai_model');
                      
                      if (!provider || !apiKey || !model) {
                        alert('❌ Veuillez remplir tous les champs');
                        return;
                      }

                      const success = AIService.configure({ provider, apiKey, model });
                      
                      if (success) {
                        const test = await AIService.testConnection();
                        if (test.cost) {
                          alert(`${test.message}\n\nCoût du test: $${test.cost.toFixed(4)}`);
                        } else {
                          alert(test.message);
                        }
                      } else {
                        alert('❌ Erreur de configuration');
                      }
                    }}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
                  >
                    Tester la connexion
                  </button>

                  <button
                    onClick={() => {
                      const models = AIService.getAvailableModels();
                      const provider = localStorage.getItem('ai_provider') || 'openai';
                      const modelList = models[provider as keyof typeof models].map(m => {
                        const info = AIService.getModelInfo(m);
                        return `${info?.name}\n  ${info?.description}\n  Input: $${info?.pricing.input}/1K tokens\n  Output: $${info?.pricing.output}/1K tokens`;
                      }).join('\n\n');
                      
                      alert(`🤖 MODÈLES ${provider.toUpperCase()}\n\n${modelList}`);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Voir modèles & prix
                  </button>
                </div>

                <div className={`p-4 rounded-lg ${
                  AIService.isReady() 
                    ? 'bg-pink-50 border-2 border-pink-200' 
                    : 'bg-yellow-50 border-2 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-2 text-sm">
                    {AIService.isReady() ? (
                      <>
                        <Check size={18} className="text-pink-600" />
                        <span className="font-medium text-pink-800">
                          ✅ IA activée: {AIService.getProvider()} ({AIService.getModel()})
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={18} className="text-yellow-600" />
                        <span className="font-medium text-yellow-800">⚠️ IA non configurée (réponses simulées)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-pink-50 rounded-lg p-4 border-2 border-pink-200">
                  <h4 className="font-bold text-pink-900 mb-2">🤖 Setup IA</h4>
                  <ol className="space-y-1 text-xs text-pink-800">
                    <li>1. Créer compte OpenAI ou Anthropic</li>
                    <li>2. Générer API key</li>
                    <li>3. Copier clé ici</li>
                    <li>4. Choisir modèle (recommandé: GPT-4 ou Claude Sonnet)</li>
                    <li>5. Tester connexion</li>
                  </ol>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 border-2 border-orange-200">
                  <h4 className="font-bold text-orange-900 mb-2">🎯 Fonctionnalités IA</h4>
                  <ul className="space-y-1 text-xs text-orange-800">
                    <li>✅ Génération messages de bienvenue</li>
                    <li>✅ Rédaction descriptions propriétés (SEO)</li>
                    <li>✅ Suggestions prix dynamiques</li>
                    <li>✅ Création scénarios automatisation</li>
                    <li>✅ Analyse données réservations</li>
                    <li>✅ Réponses personnalisées contextuelles</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2">💰 Coûts approximatifs</h4>
                  <div className="space-y-1 text-xs text-blue-800">
                    <p><strong>GPT-4:</strong> ~$0.03-0.06 / 1K tokens (1 message ≈ $0.01-0.05)</p>
                    <p><strong>GPT-3.5:</strong> ~$0.001-0.002 / 1K tokens (très économique)</p>
                    <p><strong>Claude Opus:</strong> ~$0.015-0.075 / 1K tokens</p>
                    <p><strong>Claude Sonnet:</strong> ~$0.003-0.015 / 1K tokens (recommandé)</p>
                    <p className="mt-2 font-bold">Usage typique: $5-20/mois selon volume</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🔐 Identifiants de connexion</h2>
              <p className="text-sm text-gray-600 mb-6">
                Modifiez vos identifiants pour sécuriser l'accès à l'application.
              </p>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <p className="font-medium text-blue-900 mb-1">Identifiants actuels :</p>
                  <p className="text-sm text-blue-800">👤 Username: <code className="font-mono bg-white px-2 py-1 rounded">admin</code></p>
                  <p className="text-sm text-blue-800">🔑 Password: <code className="font-mono bg-white px-2 py-1 rounded">admin123</code></p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="font-bold text-yellow-900 mb-2">⚠️ Prochaine version</p>
                  <p className="text-sm text-yellow-800">
                    La modification des identifiants sera disponible dans la prochaine mise à jour avec authentification sécurisée.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-3"><strong>Pour l'instant, protégez votre accès en :</strong></p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span>🔒</span>
                      <span>Ne partageant pas vos identifiants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>💻</span>
                      <span>Utilisant un navigateur privé sur ordinateurs partagés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>📱</span>
                      <span>Activant le verrouillage de votre appareil</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">🚪 Déconnexion</h3>
              <p className="text-sm text-gray-600 mb-4">
                Se déconnecter vous redirigera vers l'écran de connexion.
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

        {/* Cleaning Tab */}
        {activeTab === 'cleaning' && (
          <div className="space-y-6">
            {/* Contact équipe ménage */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="text-blue-600" size={20} />
                Contact équipe ménage
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Ces contacts recevront les notifications automatiques après chaque départ
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📧 Email
                  </label>
                  <input
                    type="email"
                    value={settings?.cleaningStaffEmail || ''}
                    onChange={(e) => updateSettings('cleaningStaffEmail', e.target.value)}
                    placeholder="menage@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📱 Téléphone (SMS)
                  </label>
                  <input
                    type="tel"
                    value={settings?.cleaningStaffPhone || ''}
                    onChange={(e) => updateSettings('cleaningStaffPhone', e.target.value)}
                    placeholder="+33612345678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Lien vers page agent */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm p-6 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="text-blue-600" size={20} />
                Accès page agent de ménage
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Partagez ce lien avec votre équipe de ménage pour qu'ils puissent remplir les rapports directement
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}${window.location.pathname}#cleaning-report`;
                    window.open(url, '_blank');
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <ExternalLink size={18} />
                  Ouvrir la page agent
                </button>
                
                <button
                  onClick={() => {
                    const url = `${window.location.origin}${window.location.pathname}#cleaning-report`;
                    navigator.clipboard.writeText(url);
                    alert('✅ Lien copié dans le presse-papier !');
                  }}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Copy size={18} />
                  Copier le lien
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-gray-500 mb-1">URL:</p>
                <code className="text-xs text-blue-600 break-all">
                  {window.location.origin}{window.location.pathname}#cleaning-report
                </code>
              </div>
            </div>

            {/* Checklist personnalisée */}
            <CleaningChecklistManager />
          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="text-blue-600" />
                Gestion des Données
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Sauvegarde automatique toutes les 5 minutes. Données stockées localement avec backup.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Export */}
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                  <h3 className="font-bold text-green-900 mb-3">📥 Export</h3>
                  <p className="text-sm text-green-800 mb-4">
                    Téléchargez toutes vos données en JSON
                  </p>
                  <button
                    onClick={() => {
                      const data = StorageManager.exportAllData();
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `gitemaster-backup-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      alert('✅ Export réussi !');
                    }}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Télécharger Backup
                  </button>
                </div>

                {/* Import */}
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3">📤 Import</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Restaurez vos données depuis un fichier
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const data = event.target?.result as string;
                          if (StorageManager.importAllData(data)) {
                            alert('✅ Import réussi ! La page va se recharger.');
                            window.location.reload();
                          } else {
                            alert('❌ Erreur lors de l\'import');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="hidden"
                    id="import-file"
                  />
                  <label
                    htmlFor="import-file"
                    className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center cursor-pointer"
                  >
                    Importer Backup
                  </label>
                </div>
              </div>
            </div>

            {/* Diagnostics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Diagnostics</h3>
              <button
                onClick={() => {
                  StorageManager.printDiagnostics();
                  const info = StorageManager.getStorageInfo();
                  alert(
                    `📊 DIAGNOSTICS\n\n` +
                    `Espace utilisé: ${(info.used / 1024).toFixed(2)} KB\n` +
                    `Disponible: ${(info.available / 1024).toFixed(2)} KB\n` +
                    `Pourcentage: ${info.percentUsed.toFixed(2)}%\n\n` +
                    `Réservations: ${DataService.getBookings().length}\n` +
                    `Tâches ménage: ${DataService.getCleaningTasks().length}\n` +
                    `Propriétés: ${StorageManager.loadProperties().length}\n\n` +
                    `Détails complets dans la console (F12)`
                  );
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Afficher les diagnostics
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Ouvrez la console (F12) pour voir les détails complets
              </p>
            </div>

            {/* Backup Auto */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🔄 Backup Automatique</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>✅ Actif</strong> - Sauvegarde automatique toutes les 5 minutes
                </p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• Double sauvegarde (principale + backup)</li>
                  <li>• Restauration automatique en cas d'erreur</li>
                  <li>• Vérification d'intégrité</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  StorageManager.autoBackup();
                  alert('✅ Backup manuel effectué !');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Forcer un backup maintenant
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-red-200">
              <h3 className="text-lg font-bold text-red-900 mb-4">⚠️ Zone Dangereuse</h3>
              <p className="text-sm text-red-700 mb-4">
                Ces actions sont <strong>irréversibles</strong>. Exportez vos données avant !
              </p>
              <button
                onClick={() => StorageManager.clearAllData()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                🗑️ Effacer toutes les données
              </button>
            </div>
          </div>
        )}

        </div> {/* Fin content div p-8 */}
      </div> {/* Fin main content flex-1 */}
    </div> {/* Fin layout flex */}
  );
};

export default AdminPage;
