import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Calendar, Clock, User, Check, X, AlertCircle, CheckSquare } from 'lucide-react';

interface CleaningTask {
  id: string;
  bookingId: string;
  guestName: string;
  propertyName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  assignedTo?: string;
  assignedPhone?: string;
  cost: number;
  checklist: ChecklistItem[];
  notes?: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: '1', task: 'Changer les draps', completed: false },
  { id: '2', task: 'Aspirer et laver le sol', completed: false },
  { id: '3', task: 'Nettoyer salle de bain', completed: false },
  { id: '4', task: 'Nettoyer cuisine', completed: false },
  { id: '5', task: 'Vider poubelles', completed: false },
  { id: '6', task: 'Vérifier stocks (PQ, savon)', completed: false },
];

const CleaningModule: React.FC = () => {
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CleaningTask | null>(null);
  const [formData, setFormData] = useState({
    guestName: '',
    propertyName: 'Villa Exemple',
    scheduledDate: '',
    scheduledTime: '14:00',
    assignedTo: '',
    assignedPhone: '',
    cost: 80,
    notes: ''
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const saved = localStorage.getItem('gitemaster_cleaning');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  };

  const saveTasks = (newTasks: CleaningTask[]) => {
    localStorage.setItem('gitemaster_cleaning', JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  const handleCreateTask = () => {
    if (!formData.guestName || !formData.scheduledDate) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    const newTask: CleaningTask = {
      id: `clean_${Date.now()}`,
      bookingId: `booking_${Date.now()}`,
      guestName: formData.guestName,
      propertyName: formData.propertyName,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      status: formData.assignedTo ? 'assigned' : 'pending',
      assignedTo: formData.assignedTo || undefined,
      assignedPhone: formData.assignedPhone || undefined,
      cost: formData.cost,
      checklist: DEFAULT_CHECKLIST.map(item => ({ ...item })),
      notes: formData.notes || undefined
    };

    saveTasks([...tasks, newTask]);
    setShowModal(false);
    setFormData({
      guestName: '',
      propertyName: 'Villa Exemple',
      scheduledDate: '',
      scheduledTime: '14:00',
      assignedTo: '',
      assignedPhone: '',
      cost: 80,
      notes: ''
    });
  };

  const handleUpdateStatus = (taskId: string, newStatus: CleaningTask['status']) => {
    const updated = tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    saveTasks(updated);
  };

  const handleToggleChecklistItem = (taskId: string, itemId: string) => {
    const updated = tasks.map(task => {
      if (task.id === taskId) {
        const newChecklist = task.checklist.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const allCompleted = newChecklist.every(item => item.completed);
        return {
          ...task,
          checklist: newChecklist,
          status: allCompleted ? 'completed' : task.status
        };
      }
      return task;
    });
    saveTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Supprimer cette tâche ?')) {
      saveTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'assigned': return 'Assignée';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };

  const stats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    today: tasks.filter(t => t.scheduledDate === new Date().toISOString().split('T')[0]).length,
    thisWeek: tasks.filter(t => {
      const taskDate = new Date(t.scheduledDate);
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return taskDate >= today && taskDate <= weekFromNow;
    }).length
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-blue-600" size={32} />
            Gestion Ménage
          </h1>
          <p className="text-gray-600 mt-1">Planning et suivi des tâches de ménage</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          <Plus size={20} />
          <span>Nouvelle tâche</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-600">En attente</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
              <p className="text-sm text-gray-600">Aujourd'hui</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.thisWeek}</p>
              <p className="text-sm text-gray-600">Cette semaine</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <Sparkles size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune tâche de ménage</h3>
            <p className="text-gray-600 mb-6">Créez votre première tâche pour commencer</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Créer une tâche
            </button>
          </div>
        ) : (
          tasks.map(task => {
            const completed = task.checklist.filter(i => i.completed).length;
            const total = task.checklist.length;
            const progress = (completed / total) * 100;

            return (
              <div key={task.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{task.propertyName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Après le départ de {task.guestName}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{new Date(task.scheduledDate).toLocaleDateString('fr-FR')} à {task.scheduledTime}</span>
                  </div>
                  
                  {task.assignedTo && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={16} />
                      <span>{task.assignedTo}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    {task.cost}€
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progression</span>
                    <span className="font-medium">{completed}/{total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Checklist */}
                {task.status === 'in-progress' && (
                  <div className="mb-4 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <CheckSquare size={18} />
                      Checklist
                    </h4>
                    <div className="space-y-2">
                      {task.checklist.map(item => (
                        <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggleChecklistItem(task.id, item.id)}
                            className="w-5 h-5 rounded border-gray-300"
                          />
                          <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {item.task}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, 'assigned')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Assigner
                    </button>
                  )}
                  {task.status === 'assigned' && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, 'in-progress')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                    >
                      Commencer
                    </button>
                  )}
                  {task.status === 'in-progress' && completed === total && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, 'completed')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                    >
                      <Check size={16} />
                      Terminer
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Nouvelle tâche de ménage</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client (départ) *</label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Marie Dubois"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure</label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intervenant</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Sophie"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.assignedPhone}
                    onChange={(e) => setFormData({...formData, assignedPhone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coût (€)</label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Remarques particulières..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CleaningModule;
