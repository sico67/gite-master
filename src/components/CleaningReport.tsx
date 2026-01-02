import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Camera, Send } from 'lucide-react';
import { PROPERTIES } from '../services/mockData';

interface CleaningReportProps {
  onBack: () => void;
}

export const CleaningReport: React.FC<CleaningReportProps> = ({ onBack }) => {
  const [selectedProperty, setSelectedProperty] = useState(PROPERTIES[0]?.id || '');
  const [checkItems, setCheckItems] = useState({
    kitchen: false,
    bathroom: false,
    bedroom: false,
    living: false,
    trash: false,
    linen: false,
  });
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleToggle = (item: keyof typeof checkItems) => {
    setCheckItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const allChecked = Object.values(checkItems).every(v => v);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rapport Envoyé !</h1>
          <p className="text-gray-600">Merci pour votre travail</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-purple-600 text-white p-6 shadow-lg">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 mb-4 hover:bg-purple-700 px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-3xl font-bold">Rapport de Ménage</h1>
        <p className="text-purple-100 mt-2">Complétez la checklist</p>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Sélection Propriété */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Propriété
            </label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {PROPERTIES.map(prop => (
                <option key={prop.id} value={prop.id}>{prop.name}</option>
              ))}
            </select>
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Checklist</h2>
            
            <div className="space-y-3">
              {[
                { key: 'kitchen', label: 'Cuisine nettoyée' },
                { key: 'bathroom', label: 'Salle de bain nettoyée' },
                { key: 'bedroom', label: 'Chambres nettoyées' },
                { key: 'living', label: 'Salon nettoyé' },
                { key: 'trash', label: 'Poubelles vidées' },
                { key: 'linen', label: 'Draps changés' },
              ].map(item => (
                <label
                  key={item.key}
                  className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
                    checkItems[item.key as keyof typeof checkItems]
                      ? 'bg-green-50 border-2 border-green-500'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checkItems[item.key as keyof typeof checkItems]}
                    onChange={() => handleToggle(item.key as keyof typeof checkItems)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="flex-1 font-medium text-gray-900">{item.label}</span>
                  {checkItems[item.key as keyof typeof checkItems] && (
                    <CheckCircle size={20} className="text-green-600" />
                  )}
                </label>
              ))}
            </div>

            {/* Progression */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progression</span>
                <span>{Object.values(checkItems).filter(v => v).length} / 6</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${(Object.values(checkItems).filter(v => v).length / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Photos (optionnel)</h2>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors"
            >
              <Camera size={24} className="text-gray-400" />
              <span className="text-gray-600">Ajouter des photos</span>
            </button>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes / Problèmes rencontrés
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Exemple : Tache sur le canapé, ampoule à changer..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Submit */}
          <div className="bg-white rounded-xl shadow-md p-6">
            {!allChecked && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <AlertCircle size={20} className="text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Complétez toute la checklist avant d'envoyer
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={!allChecked}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors ${
                allChecked
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
              <span>Envoyer le Rapport</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
