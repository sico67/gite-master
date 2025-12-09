import React, { useState, useEffect } from 'react';
import { Zap, Plus, Clock, Send, Edit, Trash2, Play, Pause, CheckCircle } from 'lucide-react';

interface AutomationScenario {
  id: string;
  name: string;
  trigger: 'booking_confirmed' | 'days_before_checkin' | 'checkin_day' | 'days_before_checkout' | 'checkout_day' | 'days_after_checkout';
  triggerOffset?: number;
  enabled: boolean;
  templateId: string;
  channel: 'message' | 'email' | 'sms';
}

interface MessageTemplate {
  id: string;
  name: string;
  type: string;
  content: string;
  variables: string[];
}

interface AutomationLog {
  id: string;
  scenarioName: string;
  guestName: string;
  date: string;
  status: 'sent' | 'scheduled' | 'failed';
  channel: string;
}

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    id: 'welcome',
    name: 'Message de bienvenue',
    type: 'welcome',
    content: `Bonjour {guest} ! 🎉

Bienvenue ! Nous sommes ravis de vous accueillir.

Votre séjour à {property} du {checkin} au {checkout} est confirmé !

À très bientôt !`,
    variables: ['guest', 'property', 'checkin', 'checkout']
  },
  {
    id: 'pre_arrival',
    name: 'Informations pré-arrivée (J-3)',
    type: 'pre_arrival',
    content: `Bonjour {guest},

Votre arrivée approche ! Voici les informations pratiques :

📍 Adresse : {address}
🕐 Check-in : à partir de 16h
🔑 Code boîte à clés : {keycode}
📱 Contact urgence : {phone}

📖 Livret d'accueil numérique :
👉 https://gitemaster.app/guide/{booking_id}

À très bientôt !`,
    variables: ['guest', 'address', 'keycode', 'phone', 'booking_id']
  },
  {
    id: 'checkin',
    name: 'Bienvenue (Jour J)',
    type: 'checkin',
    content: `Bienvenue chez vous {guest} ! 🏡

Nous espérons que vous passerez un excellent séjour !

Des questions ? N'hésitez pas à nous contacter.

Bon séjour ! ✨`,
    variables: ['guest']
  },
  {
    id: 'checkout',
    name: 'Message pré-départ (J-1)',
    type: 'checkout',
    content: `Bonjour {guest},

Votre départ est prévu demain à 11h.

Rappel check-out :
• Fermer portes/fenêtres
• Éteindre appareils
• Déposer les clés dans la boîte
• Sortir les poubelles

Merci et à bientôt ! 🙏`,
    variables: ['guest']
  },
  {
    id: 'review',
    name: 'Demande d\'avis (J+1)',
    type: 'review',
    content: `Bonjour {guest},

Nous espérons que vous avez passé un excellent séjour ! 🌟

Votre avis compte énormément pour nous :

⭐ Laisser un avis (2 min) :
👉 Google : {google_link}
👉 Airbnb : {airbnb_link}
👉 Booking : {booking_link}

Merci beaucoup et à bientôt !

PS: Profitez de -10% sur votre prochain séjour ! 🎁
Code promo : MERCI10`,
    variables: ['guest', 'google_link', 'airbnb_link', 'booking_link']
  }
];

const DEFAULT_SCENARIOS: AutomationScenario[] = [
  {
    id: '1',
    name: 'Confirmation de réservation',
    trigger: 'booking_confirmed',
    enabled: true,
    templateId: 'welcome',
    channel: 'email'
  },
  {
    id: '2',
    name: 'Infos pré-arrivée (J-3)',
    trigger: 'days_before_checkin',
    triggerOffset: -3,
    enabled: true,
    templateId: 'pre_arrival',
    channel: 'email'
  },
  {
    id: '3',
    name: 'Message de bienvenue (Jour J)',
    trigger: 'checkin_day',
    enabled: true,
    templateId: 'checkin',
    channel: 'sms'
  },
  {
    id: '4',
    name: 'Rappel check-out (J-1)',
    trigger: 'days_before_checkout',
    triggerOffset: -1,
    enabled: true,
    templateId: 'checkout',
    channel: 'message'
  },
  {
    id: '5',
    name: 'Demande d\'avis (J+1)',
    trigger: 'days_after_checkout',
    triggerOffset: 1,
    enabled: true,
    templateId: 'review',
    channel: 'email'
  }
];

const AutomationModule: React.FC = () => {
  const [scenarios, setScenarios] = useState<AutomationScenario[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedScenarios = localStorage.getItem('gitemaster_automation_scenarios');
    const savedTemplates = localStorage.getItem('gitemaster_automation_templates');
    const savedLogs = localStorage.getItem('gitemaster_automation_logs');

    if (savedScenarios) {
      setScenarios(JSON.parse(savedScenarios));
    } else {
      setScenarios(DEFAULT_SCENARIOS);
      localStorage.setItem('gitemaster_automation_scenarios', JSON.stringify(DEFAULT_SCENARIOS));
    }

    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      setTemplates(DEFAULT_TEMPLATES);
      localStorage.setItem('gitemaster_automation_templates', JSON.stringify(DEFAULT_TEMPLATES));
    }

    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    } else {
      // Demo logs
      const demoLogs: AutomationLog[] = [
        {
          id: '1',
          scenarioName: 'Confirmation de réservation',
          guestName: 'Marie Dubois',
          date: new Date().toISOString(),
          status: 'sent',
          channel: 'email'
        },
        {
          id: '2',
          scenarioName: 'Infos pré-arrivée (J-3)',
          guestName: 'Jean Martin',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'scheduled',
          channel: 'email'
        }
      ];
      setLogs(demoLogs);
      localStorage.setItem('gitemaster_automation_logs', JSON.stringify(demoLogs));
    }
  };

  const toggleScenario = (id: string) => {
    const updated = scenarios.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    setScenarios(updated);
    localStorage.setItem('gitemaster_automation_scenarios', JSON.stringify(updated));
  };

  const getTriggerText = (scenario: AutomationScenario) => {
    switch (scenario.trigger) {
      case 'booking_confirmed': return 'Réservation confirmée';
      case 'days_before_checkin': return `${Math.abs(scenario.triggerOffset || 0)} jours avant check-in`;
      case 'checkin_day': return 'Jour du check-in';
      case 'days_before_checkout': return `${Math.abs(scenario.triggerOffset || 0)} jour avant check-out`;
      case 'checkout_day': return 'Jour du check-out';
      case 'days_after_checkout': return `${scenario.triggerOffset} jour après check-out`;
      default: return scenario.trigger;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return '📧';
      case 'sms': return '💬';
      case 'message': return '💬';
      default: return '📨';
    }
  };

  const getChannelText = (channel: string) => {
    switch (channel) {
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      case 'message': return 'Message';
      default: return channel;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 border-green-300';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'failed': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Envoyé';
      case 'scheduled': return 'Programmé';
      case 'failed': return 'Échec';
      default: return status;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="text-blue-600" size={32} />
            Automatisations
          </h1>
          <p className="text-gray-600 mt-1">Messages automatiques programmés</p>
        </div>
        
        <button
          onClick={() => {
            setSelectedTemplate(null);
            setShowTemplateModal(true);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          <Plus size={20} />
          <span>Nouveau template</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{scenarios.filter(s => s.enabled).length}</p>
              <p className="text-sm text-gray-600">Scénarios actifs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{logs.filter(l => l.status === 'scheduled').length}</p>
              <p className="text-sm text-gray-600">Messages programmés</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Send className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{logs.filter(l => l.status === 'sent').length}</p>
              <p className="text-sm text-gray-600">Messages envoyés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <Zap className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Automatisation intelligente</h3>
            <p className="text-sm text-blue-700">
              Les messages sont envoyés automatiquement selon les déclencheurs configurés. 
              Variables remplacées automatiquement : nom du client, dates, propriété, liens personnalisés.
            </p>
          </div>
        </div>
      </div>

      {/* Scenarios List */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Scénarios d'automatisation</h2>
        <div className="space-y-3">
          {scenarios.map(scenario => {
            const template = templates.find(t => t.id === scenario.templateId);
            
            return (
              <div key={scenario.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getChannelIcon(scenario.channel)}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{scenario.name}</h3>
                        <p className="text-sm text-gray-600">
                          {getTriggerText(scenario)} • {getChannelText(scenario.channel)}
                        </p>
                      </div>
                    </div>
                    {template && (
                      <div className="ml-11 bg-gray-50 rounded p-3 text-sm text-gray-700">
                        <strong>Template :</strong> {template.name}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleScenario(scenario.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      scenario.enabled
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {scenario.enabled ? <Play size={16} /> : <Pause size={16} />}
                    {scenario.enabled ? 'Actif' : 'Inactif'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Templates */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Templates de messages</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {templates.map(template => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Variables : {template.variables.join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowTemplateModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit size={18} />
                </button>
              </div>
              <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 whitespace-pre-wrap">
                {template.content.substring(0, 150)}...
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Historique des envois</h2>
        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun message envoyé pour le moment</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getChannelIcon(log.channel)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{log.scenarioName}</p>
                    <p className="text-sm text-gray-600">
                      {log.guestName} • {new Date(log.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(log.status)}`}>
                  {getStatusText(log.status)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedTemplate ? 'Modifier le template' : 'Nouveau template'}
              </h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Note :</strong> Cette fonctionnalité sera disponible dans la version finale. 
                  Pour l'instant, les templates par défaut sont utilisés.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationModule;
