import React, { useState } from 'react';
import { BookOpen, Home, Wifi, MapPin, Phone, Utensils, Trash2, Star, QrCode, ExternalLink } from 'lucide-react';

interface WelcomeGuide {
  propertyName: string;
  address: string;
  wifi: { ssid: string; password: string };
  access: { gateCode: string; keyBoxCode: string; instructions: string };
  equipment: string[];
  instructions: string[];
  contacts: { host: string; emergency: string };
  activities: string[];
  checkoutList: string[];
}

const DEFAULT_GUIDE: WelcomeGuide = {
  propertyName: 'Villa Paradis',
  address: '123 Rue de la Plage, 06000 Nice',
  wifi: {
    ssid: 'Villa-Paradis-WiFi',
    password: 'Bienvenue2025!'
  },
  access: {
    gateCode: '1234A',
    keyBoxCode: '5678',
    instructions: 'Le portail se trouve à gauche de l\'entrée principale. La boîte à clés est fixée sur le mur à droite.'
  },
  equipment: [
    '🍳 Cuisine équipée (four, micro-ondes, lave-vaisselle)',
    '📺 TV connectée avec Netflix',
    '❄️ Climatisation dans toutes les pièces',
    '🧺 Machine à laver et sèche-linge',
    '🏊 Piscine chauffée (avril-octobre)',
    '🚗 Parking privé 2 places'
  ],
  instructions: [
    'Chauffage/Clim : Télécommande dans chaque pièce, température recommandée 21°C',
    'WiFi : Nom et mot de passe affichés dans le salon',
    'TV : Appuyez sur SOURCE pour passer en HDMI (Netflix connecté)',
    'Lave-linge : Programme "Coton 40°" recommandé',
    'Piscine : Produits d\'entretien dans le local technique'
  ],
  contacts: {
    host: '+33 6 12 34 56 78',
    emergency: 'Médecin : 15 | Police : 17 | Pompiers : 18'
  },
  activities: [
    '🏖️ Plage de la Baie des Anges (15 min à pied)',
    '🍴 Restaurant "Le Bistrot" (recommandé, 5 min)',
    '🛒 Super U (courses, 10 min)',
    '🎭 Vieux Nice (centre historique, 20 min)',
    '⛰️ Randonnée Mont Boron (vue panoramique, 30 min)'
  ],
  checkoutList: [
    'Fermer toutes les portes et fenêtres',
    'Éteindre toutes les lumières',
    'Éteindre chauffage/climatisation',
    'Déposer les clés dans la boîte',
    'Sortir les poubelles (bacs devant le portail)',
    'Fermer le portail en partant'
  ]
};

const WelcomeGuideModule: React.FC = () => {
  const [guide, setGuide] = useState<WelcomeGuide>(() => {
    const saved = localStorage.getItem('gitemaster_welcome_guide');
    return saved ? JSON.parse(saved) : DEFAULT_GUIDE;
  });
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'preview'>('settings');

  const handleSaveGuide = () => {
    localStorage.setItem('gitemaster_welcome_guide', JSON.stringify(guide));
    alert('✅ Livret d\'accueil sauvegardé !');
  };

  const generateGuideUrl = () => {
    return `https://gitemaster.app/guide/${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateQRCode = () => {
    // Simulate QR code generation
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateGuideUrl())}`;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="text-blue-600" size={32} />
            Livret d'Accueil Numérique
          </h1>
          <p className="text-gray-600 mt-1">Guide interactif pour vos voyageurs</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('preview')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <ExternalLink size={20} />
            <span>Aperçu</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <BookOpen className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Livret accessible 24/7</h3>
            <p className="text-sm text-blue-700">
              Chaque réservation génère un lien unique et un QR code. Vos voyageurs peuvent consulter 
              toutes les infos pratiques sur leur smartphone. Plus besoin d'imprimer !
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'settings'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Configuration
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'preview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Aperçu
        </button>
      </div>

      {activeTab === 'settings' ? (
        <div className="space-y-6">
          {/* Property Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Home className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Informations Propriété</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la propriété</label>
                <input
                  type="text"
                  value={guide.propertyName}
                  onChange={(e) => setGuide({...guide, propertyName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète</label>
                <input
                  type="text"
                  value={guide.address}
                  onChange={(e) => setGuide({...guide, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* WiFi */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Wifi className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">WiFi</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du réseau (SSID)</label>
                <input
                  type="text"
                  value={guide.wifi.ssid}
                  onChange={(e) => setGuide({...guide, wifi: {...guide.wifi, ssid: e.target.value}})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <input
                  type="text"
                  value={guide.wifi.password}
                  onChange={(e) => setGuide({...guide, wifi: {...guide.wifi, password: e.target.value}})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Access */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Accès</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code portail</label>
                <input
                  type="text"
                  value={guide.access.gateCode}
                  onChange={(e) => setGuide({...guide, access: {...guide.access, gateCode: e.target.value}})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code boîte à clés</label>
                <input
                  type="text"
                  value={guide.access.keyBoxCode}
                  onChange={(e) => setGuide({...guide, access: {...guide.access, keyBoxCode: e.target.value}})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions d'accès</label>
              <textarea
                value={guide.access.instructions}
                onChange={(e) => setGuide({...guide, access: {...guide.access, instructions: e.target.value}})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Contacts</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone hôte</label>
                <input
                  type="tel"
                  value={guide.contacts.host}
                  onChange={(e) => setGuide({...guide, contacts: {...guide.contacts, host: e.target.value}})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgences</label>
                <input
                  type="text"
                  value={guide.contacts.emergency}
                  onChange={(e) => setGuide({...guide, contacts: {...guide.contacts, emergency: e.target.value}})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                localStorage.setItem('gitemaster_welcome_guide', JSON.stringify(guide));
                alert('Livret d\'accueil sauvegardé !');
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      ) : (
        /* Preview */
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{guide.propertyName}</h1>
            <p className="text-gray-600">Bienvenue dans votre location !</p>
          </div>

          {/* QR Code */}
          <div className="text-center mb-8 p-6 bg-gray-50 rounded-lg">
            <img
              src={generateQRCode()}
              alt="QR Code"
              className="mx-auto mb-4"
            />
            <p className="text-sm text-gray-600">Scannez pour accéder au livret sur mobile</p>
            <p className="text-xs text-blue-600 mt-2">{generateGuideUrl()}</p>
          </div>

          {/* Address */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="text-blue-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Adresse</h2>
            </div>
            <p className="text-gray-700">{guide.address}</p>
          </div>

          {/* WiFi */}
          <div className="mb-8 bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="text-blue-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">WiFi</h2>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700"><strong>Réseau :</strong> {guide.wifi.ssid}</p>
              <p className="text-gray-700"><strong>Mot de passe :</strong> {guide.wifi.password}</p>
            </div>
          </div>

          {/* Access */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Home className="text-blue-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Accès</h2>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-gray-700"><strong>Code portail :</strong> {guide.access.gateCode}</p>
              <p className="text-gray-700"><strong>Code boîte à clés :</strong> {guide.access.keyBoxCode}</p>
            </div>
            <p className="text-gray-700">{guide.access.instructions}</p>
          </div>

          {/* Equipment */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="text-blue-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Équipements</h2>
            </div>
            <ul className="space-y-2">
              {guide.equipment.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Mode d'emploi</h2>
            <ul className="space-y-2">
              {guide.instructions.map((item, index) => (
                <li key={index} className="text-gray-700">• {item}</li>
              ))}
            </ul>
          </div>

          {/* Activities */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Star className="text-blue-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Activités à proximité</h2>
            </div>
            <ul className="space-y-2">
              {guide.activities.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="mb-8 bg-red-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="text-red-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Contacts</h2>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700"><strong>Hôte :</strong> <a href={`tel:${guide.contacts.host}`} className="text-blue-600">{guide.contacts.host}</a></p>
              <p className="text-gray-700"><strong>Urgences :</strong> {guide.contacts.emergency}</p>
            </div>
          </div>

          {/* Checkout */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Trash2 className="text-gray-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Checklist départ</h2>
            </div>
            <ul className="space-y-2">
              {guide.checkoutList.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <input type="checkbox" className="w-5 h-5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Merci de votre séjour ! 🌟</p>
            <p className="mt-2">Laissez-nous un avis :</p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="#" className="text-blue-600 hover:underline">Google</a>
              <a href="#" className="text-blue-600 hover:underline">Airbnb</a>
              <a href="#" className="text-blue-600 hover:underline">Booking</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeGuideModule;
