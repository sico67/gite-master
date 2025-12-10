import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Upload,
  Send,
  Clock,
  Home,
  User
} from 'lucide-react';

interface CleaningReportPublicProps {
  taskId?: string;
}

const CleaningReportPublic: React.FC<CleaningReportPublicProps> = ({ taskId = 'demo' }) => {
  const [taskInfo] = useState({
    id: taskId,
    propertyName: 'Villa Exemple',
    address: '123 Rue de la Plage, 06000 Nice',
    date: new Date().toLocaleDateString('fr-FR'),
    time: '14:00',
    cleanerName: ''
  });

  const [checklist, setChecklist] = useState([
    { id: '1', task: 'Changer les draps', completed: false },
    { id: '2', task: 'Aspirer et laver le sol', completed: false },
    { id: '3', task: 'Nettoyer salle de bain', completed: false },
    { id: '4', task: 'Nettoyer cuisine', completed: false },
    { id: '5', task: 'Vider les poubelles', completed: false },
    { id: '6', task: 'Vérifier stocks (PQ, savon)', completed: false },
    { id: '7', task: 'Nettoyer vitres', completed: false },
    { id: '8', task: 'Dépoussiérer meubles', completed: false }
  ]);

  const [photos, setPhotos] = useState<string[]>([]);
  const [issues, setIssues] = useState('');
  const [notes, setNotes] = useState('');
  const [cleanerName, setCleanerName] = useState('');
  const [duration, setDuration] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleTask = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPhotos.push(event.target.result as string);
            if (newPhotos.length === files.length) {
              setPhotos([...photos, ...newPhotos]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = () => {
    if (!cleanerName.trim()) {
      alert('Veuillez entrer votre nom');
      return;
    }

    const completed = checklist.filter(item => item.completed).length;
    const total = checklist.length;

    if (completed < total) {
      if (!confirm(`Seulement ${completed}/${total} tâches complétées. Confirmer l'envoi ?`)) {
        return;
      }
    }

    // Sauvegarder le rapport
    const report = {
      taskId,
      propertyName: taskInfo.propertyName,
      cleanerName,
      date: new Date().toISOString(),
      duration,
      checklist,
      photos: photos.length,
      issues,
      notes,
      completionRate: Math.round((completed / total) * 100)
    };

    // Sauvegarder dans localStorage (en prod, API)
    const reports = JSON.parse(localStorage.getItem('gitemaster_cleaning_reports') || '[]');
    reports.push(report);
    localStorage.setItem('gitemaster_cleaning_reports', JSON.stringify(reports));

    setSubmitted(true);
  };

  const completed = checklist.filter(item => item.completed).length;
  const total = checklist.length;
  const progress = Math.round((completed / total) * 100);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Rapport envoyé !</h2>
          <p className="text-gray-600 mb-6">
            Merci {cleanerName} pour votre travail soigné. Le rapport a été transmis au propriétaire.
          </p>
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>{completed}/{total}</strong> tâches complétées
            </p>
            <p className="text-sm text-green-800">
              <strong>{photos.length}</strong> photo(s) ajoutée(s)
            </p>
            {duration && (
              <p className="text-sm text-green-800">
                Durée : <strong>{duration} minutes</strong>
              </p>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nouveau rapport
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <ClipboardCheck size={40} />
            <div>
              <h1 className="text-3xl font-bold">Rapport de Ménage</h1>
              <p className="text-blue-100">Remplissez ce formulaire après votre intervention</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Info Propriété */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start gap-4 mb-4">
            <Home className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{taskInfo.propertyName}</h2>
              <p className="text-gray-600 text-sm">{taskInfo.address}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-bold text-gray-900">{taskInfo.date}</p>
              <p className="text-sm text-gray-600 mt-1">Heure prévue</p>
              <p className="font-bold text-gray-900">{taskInfo.time}</p>
            </div>
          </div>
        </div>

        {/* Informations Agent */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="text-purple-600" />
            Vos informations
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cleanerName}
                onChange={(e) => setCleanerName(e.target.value)}
                placeholder="Ex: Marie Dupont"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée du ménage (minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 120"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">Progression</h3>
            <span className="text-2xl font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-blue-100 text-sm mt-2">{completed} sur {total} tâches complétées</p>
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-600" />
            Checklist des tâches
          </h2>
          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleTask(item.id)}
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                  item.completed
                    ? 'bg-green-50 border-2 border-green-500'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                    item.completed
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-300'
                  }`}
                >
                  {item.completed && <CheckCircle className="text-white" size={16} />}
                </div>
                <span className={`flex-1 ${item.completed ? 'text-green-900 font-medium' : 'text-gray-700'}`}>
                  {item.task}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="text-blue-600" />
            Photos (optionnel)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Prenez quelques photos pour montrer le travail effectué
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <label className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
            <Upload className="text-blue-600" size={20} />
            <span className="text-blue-600 font-medium">Ajouter des photos</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Problèmes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-orange-600" />
            Problèmes rencontrés
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            Signalez tout problème : équipement cassé, manque de produits, etc.
          </p>
          <textarea
            value={issues}
            onChange={(e) => setIssues(e.target.value)}
            placeholder="Ex: Ampoule grillée dans la salle de bain, manque de liquide vaisselle..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="text-purple-600" />
            Notes additionnelles
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Toute information complémentaire..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit */}
        <div className="sticky bottom-4">
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Send size={24} />
            Envoyer le rapport
          </button>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Généré par <span className="font-bold text-blue-600">Gîte Master</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CleaningReportPublic;
