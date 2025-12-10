import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Wifi, 
  MapPin, 
  Phone, 
  Clock, 
  Key,
  Info,
  Utensils,
  AlertCircle,
  CheckCircle,
  Navigation,
  Coffee,
  ShoppingBag,
  Palmtree
} from 'lucide-react';

interface GuestGuidePublicProps {
  propertyId?: string;
}

const GuestGuidePublic: React.FC<GuestGuidePublicProps> = ({ propertyId = 'demo' }) => {
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGuide();
  }, [propertyId]);

  const loadGuide = () => {
    // Charger depuis localStorage ou API
    const saved = localStorage.getItem('gitemaster_welcome_guide');
    if (saved) {
      setGuide(JSON.parse(saved));
    } else {
      // Guide démo
      setGuide({
        propertyName: 'Villa Exemple',
        address: '123 Rue de la Plage, 06000 Nice',
        wifi: { ssid: 'Villa-WiFi', password: 'Bienvenue2025!' },
        access: {
          gateCode: '1234A',
          keyBoxCode: '5678',
          instructions: 'Le portail se trouve à gauche. La boîte à clés est fixée sur le mur à droite.'
        },
        checkIn: '16:00',
        checkOut: '11:00',
        equipment: [
          '🍳 Cuisine équipée complète',
          '📺 TV connectée Netflix',
          '❄️ Climatisation',
          '🧺 Machine à laver',
          '🏊 Piscine chauffée',
          '🚗 Parking privé 2 places'
        ],
        instructions: [
          'Chauffage/Clim : Télécommande dans chaque pièce, température recommandée 21°C',
          'WiFi : Nom et mot de passe affichés dans le salon',
          'TV : Appuyez sur SOURCE pour passer en HDMI',
          'Machine à laver : Programme "Coton 40°" recommandé'
        ],
        contacts: {
          host: '+33 6 12 34 56 78',
          hostName: 'Marie',
          emergency: '15 (Médecin) | 17 (Police) | 18 (Pompiers)'
        },
        activities: [
          { icon: '🏖️', name: 'Plage', distance: '15 min à pied' },
          { icon: '🍴', name: 'Restaurant Le Bistrot', distance: '5 min' },
          { icon: '🛒', name: 'Super U', distance: '10 min' },
          { icon: '🎭', name: 'Vieux Nice', distance: '20 min' },
          { icon: '⛰️', name: 'Mont Boron', distance: '30 min' }
        ],
        checkoutList: [
          'Fermer toutes les portes et fenêtres',
          'Éteindre toutes les lumières',
          'Éteindre chauffage/climatisation',
          'Déposer les clés dans la boîte',
          'Sortir les poubelles',
          'Fermer le portail'
        ],
        rules: [
          'Non fumeur (intérieur)',
          'Animaux non acceptés',
          'Respect du voisinage (silence 22h-8h)',
          'Nombre maximum de voyageurs : 6'
        ]
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre guide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Home size={48} className="mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">{guide.propertyName}</h1>
          <p className="text-blue-100 text-lg">Bienvenue ! Voici toutes les infos pour votre séjour</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Infos Essentielles */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="text-blue-600" />
            Informations essentielles
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Check-in/out */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Clock className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-bold text-gray-900">Arrivée (Check-in)</p>
                  <p className="text-gray-700">À partir de {guide.checkIn}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Clock className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-bold text-gray-900">Départ (Check-out)</p>
                  <p className="text-gray-700">Avant {guide.checkOut}</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Phone className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-bold text-gray-900">Votre hôte : {guide.contacts.hostName}</p>
                  <a href={`tel:${guide.contacts.host}`} className="text-blue-600 hover:underline">
                    {guide.contacts.host}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-bold text-gray-900">Urgences</p>
                  <p className="text-sm text-gray-700">{guide.contacts.emergency}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accès */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Key className="text-purple-600" />
            Accès au logement
          </h2>
          
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-purple-600" size={20} />
                <p className="font-bold text-gray-900">Adresse</p>
              </div>
              <p className="text-gray-700 ml-8">{guide.address}</p>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(guide.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 ml-8 text-purple-600 hover:text-purple-700 font-medium"
              >
                <Navigation size={16} />
                Ouvrir dans Google Maps
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-4 rounded-xl border-2 border-blue-300">
                <p className="font-bold text-gray-900 mb-2">🚪 Code Portail</p>
                <p className="text-3xl font-mono font-bold text-blue-700">{guide.access.gateCode}</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-50 p-4 rounded-xl border-2 border-green-300">
                <p className="font-bold text-gray-900 mb-2">🔑 Code Boîte à clés</p>
                <p className="text-3xl font-mono font-bold text-green-700">{guide.access.keyBoxCode}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">{guide.access.instructions}</p>
            </div>
          </div>
        </div>

        {/* WiFi */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Wifi size={28} />
            WiFi
          </h2>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 space-y-3">
            <div>
              <p className="text-blue-100 text-sm mb-1">Nom du réseau (SSID)</p>
              <p className="text-2xl font-bold font-mono">{guide.wifi.ssid}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Mot de passe</p>
              <p className="text-2xl font-bold font-mono">{guide.wifi.password}</p>
            </div>
          </div>
        </div>

        {/* Équipements */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Utensils className="text-blue-600" />
            Équipements disponibles
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {guide.equipment.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="text-orange-600" />
            Mode d'emploi
          </h2>
          <div className="space-y-3">
            {guide.instructions.map((instruction: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-gray-700">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activités à proximité */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Palmtree className="text-purple-600" />
            À découvrir autour de vous
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {guide.activities.map((activity: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{activity.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900">{activity.name}</p>
                    <p className="text-sm text-gray-600">{activity.distance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Règlement */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-600" />
            Règlement intérieur
          </h2>
          <div className="space-y-2">
            {guide.rules.map((rule: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                <p className="text-gray-700">{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Check-out */}
        <div className="bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={28} />
            Check-list de départ
          </h2>
          <p className="text-orange-100 mb-4">Avant de partir, merci de vérifier :</p>
          <div className="space-y-2">
            {guide.checkoutList.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur rounded-lg">
                <div className="w-6 h-6 border-2 border-white rounded flex-shrink-0"></div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-2xl mb-2">✨ Excellent séjour ! ✨</p>
          <p className="text-gray-600">
            Une question ? Contactez {guide.contacts.hostName} au{' '}
            <a href={`tel:${guide.contacts.host}`} className="text-blue-600 hover:underline font-medium">
              {guide.contacts.host}
            </a>
          </p>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Généré par <span className="font-bold text-blue-600">Gîte Master</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GuestGuidePublic;
