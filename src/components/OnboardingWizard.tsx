import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  Users, 
  DollarSign, 
  Camera, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Wifi,
  Key
} from 'lucide-react';
import PropertyService from '../services/PropertyService';

interface OnboardingWizardProps {
  onComplete: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    // Step 1: Basics
    propertyName: '',
    propertyType: 'villa' as 'villa' | 'appartement' | 'gite' | 'chambre' | 'studio',
    
    // Step 2: Location
    street: '',
    city: '',
    zipCode: '',
    country: 'France',
    
    // Step 3: Capacity
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    
    // Step 4: Pricing
    basePrice: 100,
    cleaningFee: 50,
    
    // Step 5: Access
    wifiSsid: '',
    wifiPassword: '',
    gateCode: '',
    keyBoxCode: ''
  });

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Créer la propriété
    const property = {
      id: `prop_${Date.now()}`,
      name: formData.propertyName,
      type: formData.propertyType,
      address: {
        street: formData.street,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country
      },
      capacity: {
        guests: formData.guests,
        bedrooms: formData.bedrooms,
        beds: formData.beds,
        bathrooms: formData.bathrooms
      },
      pricing: {
        basePrice: formData.basePrice,
        cleaningFee: formData.cleaningFee,
        deposit: 500,
        minStay: 2
      },
      wifi: {
        ssid: formData.wifiSsid,
        password: formData.wifiPassword
      },
      access: {
        gateCode: formData.gateCode,
        keyBoxCode: formData.keyBoxCode,
        checkInTime: '16:00',
        checkOutTime: '11:00',
        instructions: 'Instructions d\'accès personnalisées'
      },
      amenities: [
        'WiFi',
        'Cuisine équipée',
        'TV',
        'Parking'
      ],
      photos: [],
      description: {
        short: `Magnifique ${formData.propertyType} à ${formData.city}`,
        long: `Profitez d'un séjour inoubliable dans notre ${formData.propertyType} situé à ${formData.city}.`
      },
      rules: [
        'Non fumeur',
        'Respect du voisinage'
      ],
      isActive: true,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    PropertyService.addProperty(property);
    
    // Marquer onboarding comme complété
    localStorage.setItem('gitemaster_onboarding_completed', 'true');
    
    onComplete();
  };

  const canProceed = () => {
    switch(step) {
      case 1:
        return formData.propertyName.length > 0;
      case 2:
        return formData.city.length > 0 && formData.zipCode.length > 0;
      case 3:
        return formData.guests > 0 && formData.bedrooms > 0;
      case 4:
        return formData.basePrice > 0;
      case 5:
        return true; // Optionnel
      default:
        return false;
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
          </div>
          <div className="relative">
            <Sparkles size={48} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Bienvenue sur Gîte Master ! 🎉</h1>
            <p className="text-blue-100">Configurons votre première propriété en 5 minutes</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-100 h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Step Indicator */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="font-medium text-gray-600">Étape {step} sur {totalSteps}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">
              {step === 1 && "Informations de base"}
              {step === 2 && "Localisation"}
              {step === 3 && "Capacité"}
              {step === 4 && "Tarification"}
              {step === 5 && "Accès & WiFi"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[400px]">
          
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <Home className="text-blue-600 mx-auto mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre propriété</h2>
                <p className="text-gray-600">Comment s'appelle votre bien ?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la propriété *
                </label>
                <input
                  type="text"
                  value={formData.propertyName}
                  onChange={(e) => updateField('propertyName', e.target.value)}
                  placeholder="Ex: Villa Sunset, Appartement Cosy..."
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type de bien
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { value: 'villa', label: '🏠 Villa', icon: '🏠' },
                    { value: 'appartement', label: '🏢 Appart', icon: '🏢' },
                    { value: 'gite', label: '🏡 Gîte', icon: '🏡' },
                    { value: 'chambre', label: '🛏️ Chambre', icon: '🛏️' },
                    { value: 'studio', label: '🏘️ Studio', icon: '🏘️' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateField('propertyType', type.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.propertyType === type.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-medium">{type.label.split(' ')[1]}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <MapPin className="text-blue-600 mx-auto mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Localisation</h2>
                <p className="text-gray-600">Où se trouve votre bien ?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => updateField('street', e.target.value)}
                  placeholder="Ex: 123 Rue de la Plage"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Ex: Nice"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => updateField('zipCode', e.target.value)}
                    placeholder="Ex: 06000"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* STEP 3: CAPACITY */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <Users className="text-blue-600 mx-auto mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Capacité</h2>
                <p className="text-gray-600">Combien de personnes pouvez-vous accueillir ?</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    👥 Voyageurs maximum
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={(e) => updateField('guests', parseInt(e.target.value))}
                    className="w-full px-4 py-3 text-2xl text-center border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold"
                  />
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🛏️ Chambres
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => updateField('bedrooms', parseInt(e.target.value))}
                    className="w-full px-4 py-3 text-2xl text-center border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-bold"
                  />
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🛌 Lits
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.beds}
                    onChange={(e) => updateField('beds', parseInt(e.target.value))}
                    className="w-full px-4 py-3 text-2xl text-center border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-bold"
                  />
                </div>

                <div className="bg-orange-50 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🚿 Salles de bain
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => updateField('bathrooms', parseInt(e.target.value))}
                    className="w-full px-4 py-3 text-2xl text-center border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PRICING */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <DollarSign className="text-blue-600 mx-auto mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tarification</h2>
                <p className="text-gray-600">Définissez vos prix de base</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  💰 Prix par nuit *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => updateField('basePrice', parseInt(e.target.value))}
                    className="w-full px-6 py-4 text-3xl text-center border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-400">€</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Prix moyen recommandé pour votre région : 80-150€
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🧹 Frais de ménage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={formData.cleaningFee}
                    onChange={(e) => updateField('cleaningFee', parseInt(e.target.value))}
                    className="w-full px-6 py-4 text-2xl text-center border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">€</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Montant unique par séjour
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <p className="text-sm text-green-800 font-medium">
                  💡 Astuce : Vous pourrez ajuster vos prix par saison plus tard !
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: ACCESS */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <Key className="text-blue-600 mx-auto mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès & WiFi</h2>
                <p className="text-gray-600">Informations pratiques (optionnel)</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wifi size={24} />
                  <h3 className="text-lg font-bold">WiFi</h3>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.wifiSsid}
                    onChange={(e) => updateField('wifiSsid', e.target.value)}
                    placeholder="Nom du réseau (SSID)"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border-2 border-white/30 placeholder-white/60 text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  />
                  <input
                    type="text"
                    value={formData.wifiPassword}
                    onChange={(e) => updateField('wifiPassword', e.target.value)}
                    placeholder="Mot de passe WiFi"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border-2 border-white/30 placeholder-white/60 text-white focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🚪 Code portail
                  </label>
                  <input
                    type="text"
                    value={formData.gateCode}
                    onChange={(e) => updateField('gateCode', e.target.value)}
                    placeholder="Ex: 1234A"
                    className="w-full px-4 py-3 text-xl text-center font-mono border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold"
                  />
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🔑 Code boîte à clés
                  </label>
                  <input
                    type="text"
                    value={formData.keyBoxCode}
                    onChange={(e) => updateField('keyBoxCode', e.target.value)}
                    placeholder="Ex: 5678"
                    className="w-full px-4 py-3 text-xl text-center font-mono border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-bold"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ⚠️ Ces informations pourront être modifiées à tout moment dans Admin → Propriétés
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t flex items-center justify-between gap-4">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              step === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft size={20} />
            Précédent
          </button>

          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              canProceed()
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {step === totalSteps ? (
              <>
                <CheckCircle size={20} />
                Terminer
              </>
            ) : (
              <>
                Suivant
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OnboardingWizard;
