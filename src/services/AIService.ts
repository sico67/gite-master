/**
 * AIService - Assistant IA Réel
 * 
 * Providers:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Anthropic (Claude)
 * 
 * Features:
 * - Génération texte
 * - Analyse données
 * - Suggestions intelligentes
 * - Multi-providers
 */

interface AIConfig {
  provider: 'openai' | 'anthropic';
  apiKey: string;
  model?: string;
}

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  success: boolean;
  text?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost?: number;
  };
  error?: string;
}

class AIService {
  private static instance: AIService;
  private provider: 'openai' | 'anthropic' | null = null;
  private apiKey: string = '';
  private model: string = '';
  private isConfigured: boolean = false;

  // Prix par 1K tokens (approximatifs)
  private readonly PRICING = {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'claude-3-opus': { input: 0.015, output: 0.075 },
    'claude-3-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-haiku': { input: 0.00025, output: 0.00125 }
  };

  private constructor() {
    this.loadConfig();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // ========== CONFIGURATION ==========

  private loadConfig(): void {
    const provider = localStorage.getItem('ai_provider') as 'openai' | 'anthropic' | null;
    const apiKey = localStorage.getItem('ai_api_key');
    const model = localStorage.getItem('ai_model');

    if (provider && apiKey && model) {
      this.configure({ provider, apiKey, model });
    } else {
      console.warn('⚠️ AI: Non configuré. Réponses simulées.');
    }
  }

  configure(config: AIConfig): boolean {
    try {
      this.provider = config.provider;
      this.apiKey = config.apiKey;
      this.model = config.model || this.getDefaultModel(config.provider);
      this.isConfigured = true;

      // Sauvegarder config
      localStorage.setItem('ai_provider', config.provider);
      localStorage.setItem('ai_api_key', config.apiKey);
      localStorage.setItem('ai_model', this.model);

      console.log(`✅ AI: Configuré (${config.provider} - ${this.model})`);
      return true;
    } catch (error) {
      console.error('❌ AI: Erreur configuration', error);
      this.isConfigured = false;
      return false;
    }
  }

  isReady(): boolean {
    return this.isConfigured && this.apiKey.length > 0;
  }

  getProvider(): string {
    return this.provider || 'simulation';
  }

  getModel(): string {
    return this.model || 'simulation';
  }

  private getDefaultModel(provider: 'openai' | 'anthropic'): string {
    return provider === 'openai' ? 'gpt-4' : 'claude-3-sonnet-20240229';
  }

  // ========== GÉNÉRATION IA ==========

  async generate(
    prompt: string,
    options: {
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
      context?: any;
    } = {}
  ): Promise<AIResponse> {
    
    if (!this.isReady()) {
      return this.simulateResponse(prompt, options);
    }

    const messages: AIMessage[] = [];

    // System prompt
    if (options.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt
      });
    }

    // User prompt avec contexte
    let userContent = prompt;
    if (options.context) {
      userContent = `Contexte: ${JSON.stringify(options.context, null, 2)}\n\n${prompt}`;
    }
    
    messages.push({
      role: 'user',
      content: userContent
    });

    try {
      if (this.provider === 'openai') {
        return await this.generateOpenAI(messages, options);
      } else if (this.provider === 'anthropic') {
        return await this.generateAnthropic(messages, options);
      } else {
        return this.simulateResponse(prompt, options);
      }
    } catch (error: any) {
      console.error('❌ AI: Erreur génération', error);
      return { success: false, error: error.message };
    }
  }

  // ========== OPENAI ==========

  private async generateOpenAI(
    messages: AIMessage[],
    options: any
  ): Promise<AIResponse> {
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || '';
    
    // Calculer coût
    const usage = data.usage;
    const pricing = this.PRICING[this.model as keyof typeof this.PRICING] || this.PRICING['gpt-4'];
    const cost = (
      (usage.prompt_tokens / 1000) * pricing.input +
      (usage.completion_tokens / 1000) * pricing.output
    );

    console.log(`🤖 OpenAI: ${usage.total_tokens} tokens, $${cost.toFixed(4)}`);

    return {
      success: true,
      text,
      usage: {
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        cost
      }
    };
  }

  // ========== ANTHROPIC ==========

  private async generateAnthropic(
    messages: AIMessage[],
    options: any
  ): Promise<AIResponse> {
    
    // Séparer system et messages
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.model,
        system: systemPrompt,
        messages: userMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })),
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API error');
    }

    const data = await response.json();
    const text = data.content[0]?.text || '';
    
    // Calculer coût
    const usage = data.usage;
    const pricing = this.PRICING[this.model as keyof typeof this.PRICING] || this.PRICING['claude-3-sonnet'];
    const cost = (
      (usage.input_tokens / 1000) * pricing.input +
      (usage.output_tokens / 1000) * pricing.output
    );

    console.log(`🤖 Claude: ${usage.input_tokens + usage.output_tokens} tokens, $${cost.toFixed(4)}`);

    return {
      success: true,
      text,
      usage: {
        prompt_tokens: usage.input_tokens,
        completion_tokens: usage.output_tokens,
        total_tokens: usage.input_tokens + usage.output_tokens,
        cost
      }
    };
  }

  // ========== PROMPTS SPÉCIALISÉS ==========

  async generateWelcomeMessage(context: {
    guestName: string;
    propertyName: string;
    checkIn: string;
    checkOut: string;
    wifiSSID?: string;
    wifiPassword?: string;
    gateCode?: string;
    keyBoxCode?: string;
  }): Promise<AIResponse> {
    
    const prompt = `Rédige un message de bienvenue chaleureux et professionnel pour un voyageur.

Ton: Amical, accueillant, informatif
Format: Email (avec salutations)
Longueur: 150-200 mots

Inclus obligatoirement:
- Remerciements personnalisés
- Rappel dates séjour
- Instructions accès (codes)
- WiFi
- Contact en cas de besoin
- Souhait bon séjour

Utilise des emojis avec parcimonie (2-3 max).`;

    return this.generate(prompt, {
      systemPrompt: 'Tu es un assistant spécialisé en location saisonnière. Tu rédiges des messages professionnels et chaleureux.',
      context,
      temperature: 0.8,
      maxTokens: 500
    });
  }

  async generatePropertyDescription(context: {
    propertyName: string;
    type: string;
    city: string;
    guests: number;
    bedrooms: number;
    amenities: string[];
  }): Promise<AIResponse> {
    
    const prompt = `Rédige une description attractive pour une annonce de location saisonnière.

Objectif: Maximiser conversions (réservations)
Ton: Enthousiaste, descriptif, authentique
Format: 2 paragraphes (court + long)
Optimisation: SEO (mots-clés naturels)

Structure:
1. Titre accrocheur (50 caractères max)
2. Description courte (150 caractères - meta)
3. Description longue (300-400 mots):
   - Introduction captivante
   - Espaces & confort
   - Équipements phares
   - Localisation & activités
   - Call-to-action

Mots-clés à intégrer naturellement: ${context.type}, ${context.city}, ${context.guests} personnes, location saisonnière, vacances.`;

    return this.generate(prompt, {
      systemPrompt: 'Tu es un copywriter expert en immobilier de vacances et SEO.',
      context,
      temperature: 0.9,
      maxTokens: 800
    });
  }

  async suggestPricing(context: {
    propertyType: string;
    city: string;
    guests: number;
    season: 'low' | 'mid' | 'high';
    currentPrice?: number;
  }): Promise<AIResponse> {
    
    const prompt = `Suggère une stratégie de tarification dynamique pour cette propriété.

Analyse:
- Marché local
- Saisonnalité
- Capacité
- Positionnement concurrentiel

Fournis:
1. Prix recommandé par nuit (en €)
2. Justification (2-3 phrases)
3. Prix min/max fourchette
4. 3 conseils optimisation revenus

Format: JSON structuré
Sois concret et actionnable.`;

    return this.generate(prompt, {
      systemPrompt: 'Tu es un expert en yield management pour locations saisonnières.',
      context,
      temperature: 0.6,
      maxTokens: 600
    });
  }

  async createAutomationScenario(context: {
    trigger: string;
    goal: string;
    propertyName: string;
  }): Promise<AIResponse> {
    
    const prompt = `Crée un scénario d'automatisation complet pour la gestion de location saisonnière.

Objectif: ${context.goal}
Déclencheur: ${context.trigger}

Structure attendue:
1. Nom du scénario (court)
2. Conditions de déclenchement (précises)
3. Actions à effectuer (étape par étape)
4. Template message (si applicable)
5. Variables dynamiques à utiliser

Format: Structuré et actionnable
Ton: Professionnel, clair`;

    return this.generate(prompt, {
      systemPrompt: 'Tu es un expert en automatisation de processus pour conciergeries.',
      context,
      temperature: 0.7,
      maxTokens: 700
    });
  }

  async analyzeBookingData(bookings: any[]): Promise<AIResponse> {
    
    const prompt = `Analyse ces données de réservations et fournis des insights actionnables.

Fournis:
1. Tendances principales (3-4 insights)
2. Opportunités d'optimisation (2-3)
3. Alertes/risques éventuels (1-2)
4. Recommandations concrètes (3)

Format: Structuré avec titres
Sois analytique et data-driven.`;

    const summary = {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      avgPrice: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0) / bookings.length,
      avgGuests: bookings.reduce((sum, b) => sum + (b.guests || 0), 0) / bookings.length,
      sources: bookings.reduce((acc, b) => {
        acc[b.source] = (acc[b.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return this.generate(prompt, {
      systemPrompt: 'Tu es un analyste business spécialisé en hospitality.',
      context: { summary, bookings: bookings.slice(0, 10) }, // Limiter contexte
      temperature: 0.5,
      maxTokens: 800
    });
  }

  // ========== SIMULATION ==========

  private async simulateResponse(prompt: string, options: any): Promise<AIResponse> {
    console.log('🤖 SIMULATION IA:', prompt.substring(0, 100) + '...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const responses: Record<string, string> = {
      'bienvenue': `Bonjour {guestName} ! 🌟

Nous sommes ravis de vous accueillir prochainement dans notre magnifique {propertyName} !

📅 Votre séjour: du {checkIn} au {checkOut}

🔑 ACCÈS:
• Code portail: {gateCode}
• Code boîte à clés: {keyBoxCode}

📡 WIFI:
• Réseau: {wifiSSID}
• Mot de passe: {wifiPassword}

Pour toute question, nous sommes disponibles 24/7 au +33 6 12 34 56 78.

Au plaisir de vous recevoir ! ✨
L'équipe {propertyName}`,

      'description': `🏡 **Villa Moderne avec Vue Mer - Votre Oasis Méditerranéenne**

**Description courte (meta):**
Superbe villa 4★ avec piscine privée et vue mer panoramique. À 10min des plages. Terrasse, parking, climatisation. Séjour de rêve à ${options.context?.city} !

**Description longue:**

✨ Découvrez notre magnifique ${options.context?.type} nichée sur les hauteurs de ${options.context?.city}, offrant une vue mer imprenable sur la Baie des Anges.

🏊 **Pourquoi nos voyageurs nous adorent:**
• Piscine chauffée privée (toute l'année)
• Terrasse panoramique avec vue mer
• Climatisation dans toutes les pièces
• Smart TV Netflix, WiFi haut débit
• Parking privé sécurisé

🛏️ **Espace & Confort** (120m²)
Idéal pour ${options.context?.guests} personnes, ${options.context?.bedrooms} chambres spacieuses avec literie premium, 2 salles de bain modernes, cuisine équipée complète.

📍 **Emplacement Idéal**
À 10min des plages, 15min du centre historique, commerces et restaurants à 5min. Parfait pour découvrir la Côte d'Azur tout en profitant du calme.

📅 **Réservez maintenant** et profitez d'un séjour inoubliable !`,

      'pricing': `{
  "recommended_price": 145,
  "justification": "Prix optimal basé sur l'analyse du marché local pour un ${options.context?.propertyType} ${options.context?.guests} personnes à ${options.context?.city}. Positionnement mid-premium permettant un taux d'occupation élevé tout en maximisant les revenus.",
  "price_range": {
    "min": 120,
    "max": 180
  },
  "optimization_tips": [
    "Appliquer un rabais de 15% pour réservations >30 jours à l'avance",
    "Augmenter de 25% pendant événements locaux (festivals, grands prix)",
    "Proposer -10% pour séjours 7+ nuits en basse saison"
  ]
}`,

      'automation': `**Scénario: Rappel Check-out J-1**

**Déclencheur:**
• 24h avant l'heure de check-out
• Statut réservation: "confirmée"

**Conditions:**
✓ Voyageur actuellement en séjour
✓ Aucun message envoyé dans les 12 dernières heures

**Actions:**
1. Envoyer SMS au voyageur
2. Rappeler heure de départ ({checkOutTime})
3. Instructions sortie (clés, poubelles, lumières)
4. Demander feedback rapide

**Template Message:**
"Bonjour {guestName} ! 👋
Nous espérons que votre séjour se passe à merveille !
Petit rappel : départ demain avant {checkOutTime}.
Pensez à :
✓ Déposer les clés dans la boîte
✓ Fermer portes/fenêtres
✓ Éteindre lumières
Merci et à bientôt ! ✨"

**Variables dynamiques:**
{guestName}, {checkOutTime}, {propertyName}`,

      'analysis': `📊 **ANALYSE RÉSERVATIONS - INSIGHTS CLÉS**

**Tendances principales:**
• Taux de conversion: 68% (confirmées vs totales) - Excellent
• Panier moyen: ${options.context?.summary?.avgPrice}€ - Dans la norme marché
• Saisonnalité marquée: Pic juin-août (65% des réservations)
• Source principale: ${Object.keys(options.context?.summary?.sources || {})[0]} (60%)

**Opportunités d'optimisation:**
• Augmenter prix haute saison (+20-30% potentiel)
• Développer marketing direct pour réduire commissions
• Proposer packages expériences (activités locales)

**Alertes:**
⚠️ Taux d'annulation légèrement élevé (8%) - Revoir politique

**Recommandations:**
1. Implémenter tarification dynamique (yield management)
2. Créer programme fidélité (10% off 2ème séjour)
3. Optimiser présence Google My Business (réservations directes)`
    };

    // Détecter type de prompt
    let responseText = '';
    if (prompt.includes('bienvenue') || prompt.includes('welcome')) {
      responseText = responses.bienvenue;
    } else if (prompt.includes('description') || prompt.includes('annonce')) {
      responseText = responses.description;
    } else if (prompt.includes('prix') || prompt.includes('pricing')) {
      responseText = responses.pricing;
    } else if (prompt.includes('automation') || prompt.includes('scénario')) {
      responseText = responses.automation;
    } else if (prompt.includes('analyse') || prompt.includes('analyze')) {
      responseText = responses.analysis;
    } else {
      responseText = `Voici une réponse simulée à votre demande.

Cette fonctionnalité IA nécessite une configuration avec OpenAI ou Anthropic.

**Pour activer l'IA réelle:**
1. Admin → Intégrations → IA
2. Choisir provider (OpenAI/Anthropic)
3. Entrer API key
4. Sélectionner modèle
5. Tester connexion

Une fois configuré, vous obtiendrez des réponses personnalisées et contextuelles en temps réel.`;
    }

    // Remplacer variables
    if (options.context) {
      Object.keys(options.context).forEach(key => {
        const placeholder = `{${key}}`;
        responseText = responseText.replace(new RegExp(placeholder, 'g'), options.context[key]);
      });
    }

    return {
      success: true,
      text: responseText,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        cost: 0
      }
    };
  }

  // ========== TEST ==========

  async testConnection(): Promise<{ success: boolean; message: string; cost?: number }> {
    if (!this.isReady()) {
      return { success: false, message: 'IA non configurée' };
    }

    try {
      const result = await this.generate('Réponds juste "OK" si tu me reçois.', {
        systemPrompt: 'Tu es un assistant test.',
        maxTokens: 10,
        temperature: 0
      });

      if (result.success) {
        return { 
          success: true, 
          message: `✅ Connexion ${this.provider} réussie !`,
          cost: result.usage?.cost
        };
      } else {
        return { success: false, message: result.error || 'Erreur inconnue' };
      }
    } catch (error: any) {
      return { success: false, message: `Erreur: ${error.message}` };
    }
  }

  // ========== MODÈLES DISPONIBLES ==========

  getAvailableModels(): Record<string, string[]> {
    return {
      openai: [
        'gpt-4',
        'gpt-4-turbo-preview',
        'gpt-3.5-turbo'
      ],
      anthropic: [
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307'
      ]
    };
  }

  getModelInfo(model: string): { name: string; pricing: any; description: string } | null {
    const infos: Record<string, any> = {
      'gpt-4': {
        name: 'GPT-4',
        pricing: this.PRICING['gpt-4'],
        description: 'Le plus puissant. Excellent pour tâches complexes.'
      },
      'gpt-3.5-turbo': {
        name: 'GPT-3.5 Turbo',
        pricing: this.PRICING['gpt-3.5-turbo'],
        description: 'Rapide et économique. Bon pour tâches simples.'
      },
      'claude-3-opus-20240229': {
        name: 'Claude 3 Opus',
        pricing: this.PRICING['claude-3-opus'],
        description: 'Le plus intelligent. Raisonnement avancé.'
      },
      'claude-3-sonnet-20240229': {
        name: 'Claude 3 Sonnet',
        pricing: this.PRICING['claude-3-sonnet'],
        description: 'Équilibre performance/prix optimal.'
      },
      'claude-3-haiku-20240307': {
        name: 'Claude 3 Haiku',
        pricing: this.PRICING['claude-3-haiku'],
        description: 'Ultra rapide. Réponses instantanées.'
      }
    };

    return infos[model] || null;
  }
}

// Export singleton
const aiService = AIService.getInstance();
export default aiService;
