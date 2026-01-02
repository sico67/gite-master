import React from 'react';
import { ArrowLeft, Home, Wifi, MapPin, Phone, AlertCircle, Coffee, Utensils, Car } from 'lucide-react';

interface GuestGuideProps {
  onBack: () => void;
}

export const GuestGuide: React.FC<GuestGuideProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 mb-4 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-3xl font-bold">Livret d'Accueil</h1>
        <p className="text-blue-100 mt-2">Bienvenue dans votre location !</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Informations Pratiques */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Informations Pratiques</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Wifi className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="font-semibold">WiFi</p>
                <p className="text-gray-600">Réseau : <span className="font-mono bg-gray-100 px-2 py-1 rounded">MaLocation-WiFi</span></p>
                <p className="text-gray-600">Mot de passe : <span className="font-mono bg-gray-100 px-2 py-1 rounded">Bienvenue2024!</span></p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="font-semibold">Adresse</p>
                <p className="text-gray-600">123 Rue de la Location</p>
                <p className="text-gray-600">75001 Paris</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Car className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="font-semibold">Parking</p>
                <p className="text-gray-600">Place de parking gratuite dans la cour</p>
                <p className="text-gray-600">Code portail : 1234#</p>
              </div>
            </div>
          </div>
        </section>

        {/* Check-in / Check-out */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Arrivée / Départ</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-semibold text-green-800">Check-in</p>
              <p className="text-2xl font-bold text-green-600">15:00</p>
              <p className="text-sm text-gray-600 mt-2">Clés disponibles dans la boîte à clés</p>
              <p className="text-sm text-gray-600">Code : 5678</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="font-semibold text-orange-800">Check-out</p>
              <p className="text-2xl font-bold text-orange-600">11:00</p>
              <p className="text-sm text-gray-600 mt-2">Merci de laisser les clés dans la boîte</p>
            </div>
          </div>
        </section>

        {/* Équipements */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Coffee size={24} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Équipements</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Cuisine équipée</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Lave-linge</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>TV avec Netflix</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Chauffage central</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Sèche-cheveux</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Fer à repasser</span>
            </div>
          </div>
        </section>

        {/* Restaurants & Activités */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Utensils size={24} className="text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Bonnes Adresses</h2>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
              <p className="font-semibold">Le Petit Bistrot</p>
              <p className="text-sm text-gray-600">Restaurant français - 5 min à pied</p>
              <p className="text-sm text-gray-600">📞 01 23 45 67 89</p>
            </div>
            
            <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
              <p className="font-semibold">Boulangerie du Coin</p>
              <p className="text-sm text-gray-600">Pain frais tous les matins - 2 min</p>
            </div>
            
            <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
              <p className="font-semibold">Supermarché Carrefour</p>
              <p className="text-sm text-gray-600">Ouvert 8h-21h - 10 min à pied</p>
            </div>
          </div>
        </section>

        {/* Contacts Urgence */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Contacts d'Urgence</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="text-blue-600" size={20} />
              <div>
                <p className="font-semibold">Propriétaire</p>
                <p className="text-gray-600">+33 6 12 34 56 78</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="text-red-600" size={20} />
              <div>
                <p className="font-semibold">Urgences (Pompiers/SAMU)</p>
                <p className="text-gray-600">15 ou 112</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="text-blue-600" size={20} />
              <div>
                <p className="font-semibold">Police</p>
                <p className="text-gray-600">17</p>
              </div>
            </div>
          </div>
        </section>

        {/* Règlement */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Règlement Intérieur</h2>
          
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Respectez le calme après 22h</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Non fumeur à l'intérieur</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Les animaux ne sont pas acceptés</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Merci de trier vos déchets (poubelles dans la cour)</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
};
