import React, { useState } from 'react';
import { Lock, Settings as SettingsIcon } from 'lucide-react';
import AdminPage from './components/AdminPage';

function App() {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin === '1234') {
        setIsUnlocked(true);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Lock size={40} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gîte Master</h1>
            <p className="text-gray-600">Entrez votre code PIN</p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all ${
                  pin.length > i ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'
                }`}
              >
                {pin.length > i && <div className="w-4 h-4 bg-blue-600 rounded-full" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="h-16 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl font-bold text-2xl text-gray-900 transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleBackspace}
              className="h-16 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl text-gray-700 transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              className="h-16 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl font-bold text-2xl text-gray-900 transition-colors"
            >
              0
            </button>
            <button className="h-16 bg-blue-600 text-white rounded-xl transition-colors">
              ✓
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              PIN par défaut : <span className="font-mono font-bold">1234</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showAdmin) {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Admin button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Gîte Master v2.0</h1>
            <button
              onClick={() => setShowAdmin(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <SettingsIcon size={18} />
              <span className="hidden sm:inline">Administration</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🎉 Application déployée avec succès !</h1>
            <p className="text-xl text-gray-600">
              Cliquez sur "Administration" en haut à droite pour configurer votre application.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-lg mb-2">Dashboard</h3>
              <p className="text-gray-600">Vue d'ensemble de vos locations</p>
              <p className="text-sm text-gray-400 mt-2">Module complet à venir</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-bold text-lg mb-2">Calendrier</h3>
              <p className="text-gray-600">Gérez vos réservations</p>
              <p className="text-sm text-gray-400 mt-2">Module complet à venir</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-bold text-lg mb-2">Messagerie</h3>
              <p className="text-gray-600">Communiquez avec vos clients</p>
              <p className="text-sm text-gray-400 mt-2">Module complet à venir</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-bold text-lg mb-2">Comptabilité</h3>
              <p className="text-gray-600">Taxe de séjour automatique</p>
              <p className="text-sm text-gray-400 mt-2">Module complet à venir</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-bold text-lg mb-2">Synchronisation</h3>
              <p className="text-gray-600">Airbnb, Booking.com</p>
              <p className="text-sm text-gray-400 mt-2">Module complet à venir</p>
            </div>

            <div 
              onClick={() => setShowAdmin(true)}
              className="bg-blue-50 border-2 border-blue-600 rounded-xl shadow p-6 cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <div className="text-3xl mb-2">⚙️</div>
              <h3 className="font-bold text-lg mb-2 text-blue-900">Administration</h3>
              <p className="text-blue-700">Paramètres de l'application</p>
              <p className="text-sm text-blue-600 mt-2 font-medium">✅ Module actif - Cliquez ici</p>
            </div>
          </div>

          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-green-900 mb-2">✅ Déploiement réussi !</h3>
            <p className="text-green-700">
              Votre application Gîte Master est maintenant en ligne. 
              Accédez à l'Administration pour personnaliser vos paramètres, gérer vos propriétés et changer votre code PIN.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
