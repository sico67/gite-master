import React, { useState } from 'react';
import { Sparkles, Send, Loader, X, DollarSign } from 'lucide-react';
import AIService from '../services/AIService';

interface AIAssistantProps {
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    {
      label: "📝 Rédiger un message de bienvenue",
      prompt: "Rédige un message de bienvenue chaleureux pour mes voyageurs qui arrivent dans ma villa en bord de mer. Inclus les informations WiFi et code d'accès."
    },
    {
      label: "💰 Optimiser mes prix",
      prompt: "Suggère-moi une stratégie de tarification dynamique pour l'été dans le sud de la France. J'ai une villa 4 personnes."
    },
    {
      label: "✍️ Améliorer ma description",
      prompt: "Réécris la description de ma propriété pour la rendre plus attractive et optimisée pour le SEO. C'est une villa moderne avec piscine à Nice."
    },
    {
      label: "🤖 Créer une automatisation",
      prompt: "Crée-moi un scénario d'automatisation pour envoyer un message personnalisé 3 jours avant l'arrivée avec les infos pratiques."
    }
  ];

  const handleSendPrompt = async (customPrompt?: string) => {
    const promptToSend = customPrompt || prompt;
    if (!promptToSend.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      let result;

      // Détecter le type de prompt et utiliser la méthode appropriée
      if (promptToSend.toLowerCase().includes('bienvenue') || promptToSend.toLowerCase().includes('message')) {
        result = await AIService.generateWelcomeMessage({
          guestName: 'Marie',
          propertyName: 'Villa Paradis',
          checkIn: '2025-07-15',
          checkOut: '2025-07-22',
          wifiSSID: 'Villa-WiFi',
          wifiPassword: 'Bienvenue2025!',
          gateCode: '1234A',
          keyBoxCode: '5678'
        });
      } else if (promptToSend.toLowerCase().includes('description') || promptToSend.toLowerCase().includes('annonce')) {
        result = await AIService.generatePropertyDescription({
          propertyName: 'Villa Moderne',
          type: 'villa',
          city: 'Nice',
          guests: 4,
          bedrooms: 2,
          amenities: ['Piscine', 'WiFi', 'Climatisation', 'Parking']
        });
      } else if (promptToSend.toLowerCase().includes('prix') || promptToSend.toLowerCase().includes('tarif')) {
        result = await AIService.suggestPricing({
          propertyType: 'villa',
          city: 'Nice',
          guests: 4,
          season: 'high'
        });
      } else if (promptToSend.toLowerCase().includes('automation') || promptToSend.toLowerCase().includes('scénario')) {
        result = await AIService.createAutomationScenario({
          trigger: 'J-1 avant check-out',
          goal: 'Rappeler les instructions de départ',
          propertyName: 'Villa Paradis'
        });
      } else {
        // Génération générique
        result = await AIService.generate(promptToSend, {
          systemPrompt: 'Tu es un assistant spécialisé en gestion de locations saisonnières. Tu fournis des réponses professionnelles, précises et actionnables.',
          temperature: 0.7,
          maxTokens: 1000
        });
      }

      if (result.success && result.text) {
        // Effet typing
        let currentText = '';
        for (let i = 0; i < result.text.length; i++) {
          currentText += result.text[i];
          setResponse(currentText);
          if (i % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }

        // Afficher coût si disponible
        if (result.usage && result.usage.cost) {
          const costMessage = `\n\n---\n💰 Coût: $${result.usage.cost.toFixed(4)} (${result.usage.total_tokens} tokens)`;
          setResponse(currentText + costMessage);
        }
      } else {
        setResponse(`❌ Erreur: ${result.error || 'Erreur inconnue'}`);
      }
    } catch (error: any) {
      setResponse(`❌ Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Assistant IA</h2>
              <p className="text-purple-100 text-sm">Propulsé par Claude • POC Beta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="p-4 bg-gray-50 border-b overflow-x-auto">
          <p className="text-xs font-medium text-gray-600 mb-2">🚀 Suggestions rapides :</p>
          <div className="flex gap-2">
            {quickPrompts.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setPrompt(item.prompt);
                  handleSendPrompt(item.prompt);
                }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-purple-300 hover:bg-purple-50 transition-colors whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Response Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!response && !loading && (
            <div className="text-center text-gray-500 py-12">
              <Sparkles size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">Bonjour ! Je suis votre assistant IA 🤖</p>
              <p className="text-sm">Posez-moi une question ou utilisez les suggestions ci-dessus</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 text-purple-600">
              <Loader className="animate-spin" size={24} />
              <span>L'assistant réfléchit...</span>
            </div>
          )}

          {response && (
            <div className="prose max-w-none">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                  {response}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendPrompt()}
              placeholder="Ex: Rédige un message de bienvenue pour mes voyageurs..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={() => handleSendPrompt()}
              disabled={loading || !prompt.trim()}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                loading || !prompt.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
              }`}
            >
              <Send size={20} />
              Envoyer
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {AIService.isReady() 
              ? `✅ IA activée: ${AIService.getProvider()} (${AIService.getModel()})`
              : '💡 Mode simulation. Configurez OpenAI ou Anthropic dans Admin → Intégrations → IA pour activer l\'IA réelle.'
            }
          </p>
        </div>

      </div>
    </div>
  );
};

export default AIAssistant;
