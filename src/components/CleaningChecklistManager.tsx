import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Save, RotateCcw } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  order: number;
}

const DEFAULT_CHECKLIST = [
  'Changer les draps et taies d\'oreiller',
  'Changer les serviettes de bain',
  'Aspirer tous les sols',
  'Laver les sols',
  'Nettoyer et désinfecter la salle de bain',
  'Nettoyer et désinfecter les toilettes',
  'Nettoyer la cuisine et les surfaces',
  'Nettoyer l\'intérieur du réfrigérateur',
  'Vider toutes les poubelles',
  'Dépoussiérer les meubles',
  'Nettoyer les vitres et miroirs',
  'Vérifier les stocks (PQ, savon, produits)',
  'Aérer toutes les pièces',
  'Vérifier que tous les équipements fonctionnent',
  'Prendre des photos après nettoyage'
];

const CleaningChecklistManager: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = () => {
    const saved = localStorage.getItem('gitemaster_cleaning_checklist');
    if (saved) {
      setChecklist(JSON.parse(saved));
    } else {
      const defaultItems = DEFAULT_CHECKLIST.map((text, index) => ({
        id: `check_${Date.now()}_${index}`,
        text,
        order: index
      }));
      setChecklist(defaultItems);
      localStorage.setItem('gitemaster_cleaning_checklist', JSON.stringify(defaultItems));
    }
  };

  const saveChecklist = () => {
    setIsSaving(true);
    localStorage.setItem('gitemaster_cleaning_checklist', JSON.stringify(checklist));
    setSaveMessage('✅ Checklist enregistrée !');
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage(null);
    }, 2000);
  };

  const addItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: `check_${Date.now()}`,
      text: newItemText.trim(),
      order: checklist.length
    };
    
    setChecklist([...checklist, newItem]);
    setNewItemText('');
  };

  const removeItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === checklist.length - 1) return;

    const newChecklist = [...checklist];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newChecklist[index], newChecklist[targetIndex]] = 
    [newChecklist[targetIndex], newChecklist[index]];
    
    // Update order
    newChecklist.forEach((item, idx) => {
      item.order = idx;
    });
    
    setChecklist(newChecklist);
  };

  const resetToDefault = () => {
    if (confirm('Réinitialiser la checklist aux valeurs par défaut ? Cette action est irréversible.')) {
      const defaultItems = DEFAULT_CHECKLIST.map((text, index) => ({
        id: `check_${Date.now()}_${index}`,
        text,
        order: index
      }));
      setChecklist(defaultItems);
      localStorage.setItem('gitemaster_cleaning_checklist', JSON.stringify(defaultItems));
      setSaveMessage('✅ Checklist réinitialisée !');
      setTimeout(() => setSaveMessage(null), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Checklist de ménage</h2>
          <p className="text-sm text-gray-500 mt-1">
            Personnalisez la liste des tâches que les agents de ménage devront cocher
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetToDefault}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Réinitialiser
          </button>
          <button
            onClick={saveChecklist}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {saveMessage}
        </div>
      )}

      {/* Ajouter nouvelle tâche */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="Nouvelle tâche..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addItem}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={18} />
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-2">
        {checklist.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Aucune tâche définie</p>
        ) : (
          checklist.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 group"
            >
              {/* Drag handle */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <GripVertical size={16} className="rotate-180" />
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === checklist.length - 1}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <GripVertical size={16} />
                </button>
              </div>

              {/* Numéro */}
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>

              {/* Texte */}
              <div className="flex-1 text-gray-800">
                {item.text}
              </div>

              {/* Actions */}
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Info :</strong> Cette checklist sera utilisée pour toutes les nouvelles tâches de ménage créées. 
          Les tâches existantes ne seront pas affectées.
        </p>
      </div>
    </div>
  );
};

export default CleaningChecklistManager;
