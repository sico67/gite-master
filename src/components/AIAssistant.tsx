import React, { useState } from 'react';
import { Sparkles, Send, Loader, X } from 'lucide-react';

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
      // POC: Simulation de réponse IA
      // En production: Appel API OpenAI/Claude
      await simulateAIResponse(promptToSend);
    } catch (error) {
      setResponse('❌ Erreur: Impossible de contacter l\'assistant IA. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const simulateAIResponse = async (userPrompt: string) => {
    // Simulation délai API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Réponses simulées basées sur le type de prompt
    let simulatedResponse = '';

    if (userPrompt.toLowerCase().includes('bienvenue') || userPrompt.toLowerCase().includes('message')) {
      simulatedResponse = `📧 **Message de Bienvenue Suggéré**

Bonjour {guest} ! 👋

Nous sommes ravis de vous accueillir bientôt dans notre magnifique villa en bord de mer ! 🌊

**Informations pratiques pour votre arrivée :**

🔑 **Accès**
- Code portail : 1234A
- Code boîte à clés : 5678
- Les clés sont dans la boîte fixée à droite de l'entrée

📡 **WiFi**
- Réseau : Villa-Paradis-WiFi
- Mot de passe : Bienvenue2025!

⏰ **Check-in** : À partir de 16h
📍 **Adresse exacte** : [Votre adresse]

Pour toute question avant ou pendant votre séjour, n'hésitez pas à nous contacter au +33 6 12 34 56 78.

Au plaisir de vous recevoir !
L'équipe Villa Paradis ✨

---

💡 **Conseil** : Vous pouvez personnaliser ce message en ajoutant des recommandations locales ou des instructions spécifiques à votre propriété.`;
    } 
    else if (userPrompt.toLowerCase().includes('prix') || userPrompt.toLowerCase().includes('tarif')) {
      simulatedResponse = `💰 **Stratégie de Tarification Dynamique - Été Sud France**

**Recommandations pour villa 4 personnes :**

📊 **Prix de base suggérés :**
- Semaine standard (juin/septembre) : 120-150€/nuit
- Haute saison (juillet-août) : 180-220€/nuit
- Week-end 3 nuits : +15%
- Semaine complète : -10%

🎯 **Optimisations :**

1. **Tarification anticipée** : -20% pour réservations >90 jours
2. **Dernière minute** : -30% pour réservations <7 jours
3. **Durée minimale** : 3 nuits en semaine, 7 nuits en août
4. **Événements locaux** : +30% (Festival de Cannes, Grand Prix, etc.)

📈 **Moyenne marché concurrent :**
- Votre zone : 140-180€/nuit
- Positionnement recommandé : 160€/nuit

💡 **Conseil pro** : Activez la tarification dynamique automatique dans Admin → Propriétés pour ajuster les prix en temps réel selon la demande.`;
    }
    else if (userPrompt.toLowerCase().includes('description') || userPrompt.toLowerCase().includes('annonce')) {
      simulatedResponse = `✍️ **Description Optimisée SEO**

**TITRE** (max 50 caractères)
"Villa Moderne Piscine Chauffée - Vue Mer Nice 🌊"

**DESCRIPTION COURTE** (160 caractères - meta)
"Superbe villa 4★ avec piscine chauffée et vue mer panoramique. À 10min des plages de Nice. Terrasse, parking, climatisation. Séjour de rêve !"

**DESCRIPTION LONGUE** (Optimisée mots-clés)

🏡 **Votre Oasis Méditerranéenne à Nice**

Découvrez notre magnifique **villa contemporaine** nichée sur les hauteurs de Nice, offrant une **vue mer imprenable** sur la Baie des Anges.

✨ **Pourquoi nos voyageurs nous adorent :**
• 🏊 Piscine chauffée privée (toute l'année)
• 🌅 Terrasse panoramique avec vue mer
• ❄️ Climatisation dans toutes les pièces
• 📺 Smart TV Netflix, WiFi haut débit
• 🚗 Parking privé sécurisé
• 🏖️ À 10 minutes des plages

🛏️ **Espace & Confort** (120m²)
- 2 chambres spacieuses (lit Queen)
- 2 salles de bain modernes
- Cuisine équipée (lave-vaisselle, Nespresso)
- Salon lumineux ouvrant sur terrasse

📍 **Emplacement Idéal**
- Promenade des Anglais : 10 min
- Vieux Nice : 15 min
- Aéroport : 20 min
- Restaurants & commerces : 5 min

💎 **Services Inclus**
- Linge de maison premium
- Produits d'accueil
- Guide local personnalisé
- Assistance 7j/7

🏆 **Villa Classée 4★** - Note moyenne : 4.9/5 (127 avis)

"Un séjour exceptionnel ! Vue magnifique, propreté impeccable, hôte réactif. On reviendra !" - Sophie, août 2024

📅 **Réservez maintenant** et profitez de -20% sur votre premier séjour !

---

🔎 **Mots-clés intégrés** : villa Nice, piscine chauffée, vue mer, location saisonnière Nice, villa vacances Côte d'Azur, hébergement Nice centre`;
    }
    else if (userPrompt.toLowerCase().includes('automatisation') || userPrompt.toLowerCase().includes('scénario')) {
      simulatedResponse = `🤖 **Scénario d'Automatisation J-3**

**DÉCLENCHEUR**
⏰ 3 jours avant check-in (72h exactement)
📧 Envoi automatique email + SMS

**CONDITIONS**
✅ Statut réservation = "Confirmée"
✅ Paiement = "Reçu"
✅ Première réservation du voyageur OU dernière résa >6 mois

**MESSAGE EMAIL**

**Sujet** : "Votre arrivée approche ! Infos pratiques pour votre séjour"

**Contenu** :
\`\`\`
Bonjour {guest_name},

J-3 avant votre arrivée ! 🎉

Nous avons hâte de vous accueillir du {checkin_date} au {checkout_date}.

📍 **ACCÈS**
Adresse exacte : {property_address}
Code portail : {gate_code}
Code boîte à clés : {keybox_code}

📋 **INSTRUCTIONS**
1. Le portail se trouve à gauche de l'entrée
2. La boîte à clés est fixée sur le mur à droite
3. Les clés sont à l'intérieur

📡 **WIFI**
Réseau : {wifi_ssid}
Mot de passe : {wifi_password}

☀️ **MÉTÉO PRÉVUE**
{checkin_date} : {weather_forecast}

🍴 **NOS RECOMMANDATIONS**
- Restaurant Le Bistrot (5min à pied)
- Plage de la Baie (15min)
- Marché provençal (samedi matin)

📱 **CONTACT URGENCE**
{host_phone} (disponible 24/7)

À très bientôt !
{host_name}
\`\`\`

**SMS (160 caractères)**
"Bonjour {guest_name} ! J-3 avant votre arrivée chez nous 🏠 Email avec toutes les infos envoyé. Check-in dès {checkin_time}. À bientôt ! {host_name}"

**ACTIONS COMPLÉMENTAIRES**
1. ✅ Créer tâche ménage J-1 si pas déjà fait
2. ✅ Vérifier stocks (PQ, savon, café)
3. ✅ Logger dans historique réservation
4. 📊 Tracker ouverture email

💡 **Pour activer** : Automatisation → Scénarios → "Infos J-3" → Activer

---

🚀 **Prochaine automatisation suggérée** : Message post-séjour J+1 avec demande d'avis`;
    }
    else {
      simulatedResponse = `🤖 **Assistant IA - Réponse Générique**

Merci pour votre question ! Je suis Claude, votre assistant pour Gîte Master.

**Je peux vous aider avec :**
- 📝 Rédaction de messages et annonces
- 💰 Optimisation des prix
- 🤖 Création d'automatisations
- 📊 Analyse de performances
- ✍️ Amélioration de descriptions
- 💬 Réponses aux voyageurs

**Essayez un prompt comme :**
- "Rédige un message de bienvenue chaleureux"
- "Suggère-moi des prix pour l'été"
- "Améliore la description de ma villa"
- "Crée un scénario d'automatisation pour les check-outs"

💡 **Astuce** : Plus vous donnez de contexte (type de bien, localisation, capacité), plus mes suggestions seront précises !

---

⚠️ **Note** : Cette fonctionnalité est en version POC (Proof of Concept). 
En production, l'assistant sera connecté à GPT-4 pour des réponses personnalisées en temps réel.`;
    }

    // Effet de typing
    let currentText = '';
    for (let i = 0; i < simulatedResponse.length; i++) {
      currentText += simulatedResponse[i];
      setResponse(currentText);
      if (i % 5 === 0) { // Update tous les 5 caractères
        await new Promise(resolve => setTimeout(resolve, 10));
      }
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
            💡 POC : Réponses simulées. En production, connexion GPT-4 pour réponses personnalisées.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AIAssistant;
