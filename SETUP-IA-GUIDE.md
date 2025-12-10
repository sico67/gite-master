# 🤖 GUIDE SETUP ASSISTANT IA - TUTORIEL ILLUSTRÉ

## 📋 TABLE DES MATIÈRES
1. [OpenAI Setup](#openai-setup)
2. [Anthropic Setup](#anthropic-setup)
3. [Configuration App](#configuration-app)
4. [Utilisation](#utilisation)
5. [Coûts & Optimisation](#coûts--optimisation)

---

## 🎨 OPENAI SETUP

### **Étape 1: Créer un compte**

1. Aller sur https://platform.openai.com
2. Cliquer "Sign up"
3. Se connecter avec Google/Email
4. Vérifier l'email

```
┌──────────────────────────────────────┐
│         OPENAI PLATFORM              │
│                                      │
│   [Sign up]  [Log in]               │
│                                      │
│   Continue with Google               │
│   Continue with Microsoft            │
│   Continue with Apple                │
│                                      │
└──────────────────────────────────────┘
```

### **Étape 2: Ajouter un moyen de paiement**

1. Dashboard → Billing
2. Add payment method
3. Entrer carte bancaire
4. Définir usage limit (ex: $20/mois)

```
┌──────────────────────────────────────┐
│  💳 BILLING                          │
│                                      │
│  Payment method: [Add card]          │
│                                      │
│  Monthly limit: $20 ━━━━━━━━━━━━    │
│                                      │
│  Current usage: $0.00                │
│                                      │
└──────────────────────────────────────┘
```

### **Étape 3: Générer API Key**

1. Dashboard → API keys (menu gauche)
2. Cliquer "+ Create new secret key"
3. Nommer: "gitemaster" (optionnel)
4. Permissions: All (par défaut)
5. Cliquer "Create secret key"

```
┌──────────────────────────────────────┐
│  🔑 API KEYS                         │
│                                      │
│  [+ Create new secret key]           │
│                                      │
│  Name: [gitemaster___]              │
│  Permissions: [All ▼]                │
│                                      │
│  [Create secret key]                 │
└──────────────────────────────────────┘
```

### **Étape 4: Copier la clé**

⚠️ **IMPORTANT : La clé ne s'affiche qu'UNE FOIS !**

```
┌──────────────────────────────────────┐
│  ✅ API Key created                  │
│                                      │
│  sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxx  │
│  xxxxxxxxxxxxxxxxxxxxxxxxxxxx        │
│                                      │
│  [Copy] [Download .env]              │
│                                      │
│  ⚠️ Save this key securely!          │
│     You won't see it again.          │
└──────────────────────────────────────┘
```

1. Cliquer "Copy"
2. Coller dans un fichier sécurisé
3. NE PAS partager la clé

### **Étape 5: Vérifier le crédit**

1. Dashboard → Usage
2. Vérifier crédit disponible
3. Ajuster limits si besoin

```
┌──────────────────────────────────────┐
│  📊 USAGE                            │
│                                      │
│  Credit balance: $5.00               │
│  Usage this month: $0.00             │
│                                      │
│  [View detailed usage →]             │
└──────────────────────────────────────┘
```

---

## 🟣 ANTHROPIC SETUP

### **Étape 1: Créer un compte**

1. Aller sur https://console.anthropic.com
2. Cliquer "Sign up"
3. Se connecter avec Email
4. Vérifier l'email

```
┌──────────────────────────────────────┐
│         ANTHROPIC CONSOLE            │
│                                      │
│   Welcome to Claude                  │
│                                      │
│   [Sign up] [Log in]                │
│                                      │
│   Email: [_______________]           │
│   Password: [____________]           │
│                                      │
└──────────────────────────────────────┘
```

### **Étape 2: Ajouter crédits**

1. Console → Settings → Billing
2. Purchase credits
3. Choisir montant (ex: $20)
4. Payer par carte

```
┌──────────────────────────────────────┐
│  💳 BILLING                          │
│                                      │
│  Credit balance: $0.00               │
│                                      │
│  [Purchase credits]                  │
│   ○ $10    ○ $20    ○ $50           │
│                                      │
└──────────────────────────────────────┘
```

### **Étape 3: Générer API Key**

1. Console → API Keys
2. Cliquer "+ Create Key"
3. Nommer: "gitemaster"
4. Permissions: All
5. Cliquer "Create Key"

```
┌──────────────────────────────────────┐
│  🔑 API KEYS                         │
│                                      │
│  [+ Create Key]                      │
│                                      │
│  Name: [gitemaster___]              │
│  Type: [Standard ▼]                  │
│                                      │
│  [Create Key]                        │
└──────────────────────────────────────┘
```

### **Étape 4: Copier la clé**

```
┌──────────────────────────────────────┐
│  ✅ API Key created                  │
│                                      │
│  sk-ant-api03-xxxxxxxxxxxxxxxx      │
│  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx     │
│                                      │
│  [Copy]                              │
│                                      │
│  ⚠️ Store securely! Won't show again.│
└──────────────────────────────────────┘
```

---

## ⚙️ CONFIGURATION APP

### **Étape 1: Ouvrir Admin**

```
Gîte Master → Menu → Admin → Intégrations
```

### **Étape 2: Remplir le formulaire**

```
┌──────────────────────────────────────┐
│  🤖 INTELLIGENCE ARTIFICIELLE        │
│                                      │
│  Provider: [OpenAI ▼]                │
│           (ou Anthropic)             │
│                                      │
│  API Key: [sk-proj-xxxxxxxx]         │
│           (coller votre clé)         │
│                                      │
│  Modèle: [GPT-4 ▼]                   │
│          (ou GPT-3.5 / Claude)       │
│                                      │
│  [Tester connexion]                  │
│                                      │
└──────────────────────────────────────┘
```

### **Étape 3: Tester la connexion**

1. Cliquer "Tester connexion"
2. Attendre 2-3 secondes
3. Vérifier message: "✅ Connexion OpenAI réussie !"

```
┌──────────────────────────────────────┐
│  ✅ Connexion OpenAI réussie !       │
│                                      │
│  Coût du test: $0.0015               │
│                                      │
│         [OK]                         │
└──────────────────────────────────────┘
```

### **Étape 4: Vérifier le statut**

```
┌──────────────────────────────────────┐
│  Status:                             │
│  ✅ IA activée: openai (gpt-4)       │
│                                      │
└──────────────────────────────────────┘
```

---

## 🚀 UTILISATION

### **Ouvrir l'Assistant IA**

```
Dashboard → Bouton "🤖 Assistant IA"
```

```
┌──────────────────────────────────────┐
│  🤖 ASSISTANT IA                     │
│  Propulsé par GPT-4 • IA Réelle     │
│                                      │
├──────────────────────────────────────┤
│  🚀 Suggestions rapides:             │
│                                      │
│  [📝 Message bienvenue]              │
│  [💰 Optimiser prix]                 │
│  [✍️ Améliorer description]          │
│  [🤖 Créer automation]               │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  (Réponse IA apparaît ici)           │
│                                      │
├──────────────────────────────────────┤
│  Votre question: [_____________]     │
│                           [Envoyer]  │
│                                      │
│  ✅ IA activée: openai (gpt-4)       │
└──────────────────────────────────────┘
```

### **Exemples de prompts**

#### **1. Message de bienvenue**
```
Prompt: "Rédige un message de bienvenue pour Marie 
         qui arrive le 15 juillet dans notre villa"

Résultat: Message personnalisé avec codes accès, 
          WiFi, instructions, etc.
```

#### **2. Description propriété**
```
Prompt: "Améliore la description de ma villa 4 personnes 
         à Nice avec piscine"

Résultat: Description SEO optimisée, structurée, 
          attractive
```

#### **3. Suggestions prix**
```
Prompt: "Suggère des prix pour l'été, villa 4 personnes, 
         Nice, haute saison"

Résultat: Analyse marché, fourchette prix, conseils 
          optimisation
```

#### **4. Scénario automation**
```
Prompt: "Crée un scénario pour rappeler le check-out 
         J-1"

Résultat: Scénario complet avec déclencheur, actions, 
          template message
```

---

## 💰 COÛTS & OPTIMISATION

### **Tarification par modèle**

| Modèle | Input (1K tokens) | Output (1K tokens) | Message typique |
|--------|-------------------|--------------------|-----------------  |
| GPT-4 | $0.03 | $0.06 | $0.02-0.10 |
| GPT-3.5 Turbo | $0.0005 | $0.0015 | $0.001-0.005 |
| Claude Opus | $0.015 | $0.075 | $0.03-0.15 |
| Claude Sonnet | $0.003 | $0.015 | $0.005-0.03 |
| Claude Haiku | $0.00025 | $0.00125 | $0.001-0.005 |

### **Estimation mensuelle**

```
Usage typique Gîte Master:
├─ 20 messages bienvenue/mois
├─ 5 descriptions propriétés
├─ 10 suggestions prix
├─ 15 analyses diverses
└─ Total: ~50 requêtes/mois

Avec GPT-4: ~$5-10/mois
Avec GPT-3.5: ~$0.50-1/mois
Avec Claude Sonnet: ~$2-5/mois ✅ RECOMMANDÉ
```

### **Conseils pour économiser**

#### **1. Choisir le bon modèle**
- **Tâches simples**: GPT-3.5 ou Claude Haiku
- **Tâches complexes**: GPT-4 ou Claude Sonnet
- **Analyse avancée**: Claude Opus

#### **2. Optimiser les prompts**
```
❌ Mauvais (long):
"Peux-tu me rédiger un super message de bienvenue 
 très détaillé avec toutes les informations possibles 
 pour mes voyageurs qui arrivent bientôt..."

✅ Bon (concis):
"Message bienvenue, villa Nice, arrivée 15 juillet, 
 inclure: WiFi, codes accès, contact"
```

#### **3. Utiliser le cache**
- Sauvegarder les réponses fréquentes
- Réutiliser templates générés
- Personnaliser ensuite manuellement

#### **4. Définir des limites**
```
Admin → Intégrations → IA → Paramètres avancés

[x] Limiter à 100 requêtes/mois
[x] Alerte si budget > $10
[x] Auto-switch vers GPT-3.5 si dépassement
```

---

## 🎯 COMPARAISON PROVIDERS

### **OpenAI (GPT)**

**Avantages:**
✅ Très populaire, bien documenté
✅ GPT-4: Excellent pour rédaction
✅ GPT-3.5: Ultra économique
✅ API stable

**Inconvénients:**
❌ GPT-4 cher pour usage intensif
❌ Limites rate strict (3-5 req/min gratuit)

**Recommandé pour:**
- Rédaction marketing
- Descriptions produits
- Support client basique

### **Anthropic (Claude)**

**Avantages:**
✅ Claude Sonnet: Meilleur rapport qualité/prix
✅ Réponses plus longues (200K tokens)
✅ Excellent raisonnement
✅ Plus éthique/sûr

**Inconvénients:**
❌ Moins connu
❌ API parfois plus lente

**Recommandé pour:**
- Analyse données complexes
- Stratégie & conseil
- Automatisations avancées

---

## 🔧 TROUBLESHOOTING

### **Erreur: "Invalid API key"**

**Causes:**
- Clé incorrecte
- Clé expirée
- Clé révoquée

**Solutions:**
1. Vérifier copie (pas d'espaces)
2. Régénérer nouvelle clé
3. Vérifier compte actif

### **Erreur: "Insufficient credits"**

**Causes:**
- Crédit épuisé
- Carte refusée
- Limite atteinte

**Solutions:**
1. Recharger compte
2. Vérifier carte bancaire
3. Augmenter limites

### **Erreur: "Rate limit exceeded"**

**Causes:**
- Trop de requêtes rapides
- Plan gratuit limité

**Solutions:**
1. Attendre 1 minute
2. Passer au plan payant
3. Espacer les requêtes

### **Réponse lente**

**Causes:**
- Modèle lourd (GPT-4, Claude Opus)
- Prompt très long
- Serveur chargé

**Solutions:**
1. Utiliser modèle plus rapide
2. Réduire longueur prompt
3. Réessayer plus tard

---

## 📚 RESSOURCES

### **OpenAI**
- Docs: https://platform.openai.com/docs
- Pricing: https://openai.com/pricing
- Status: https://status.openai.com

### **Anthropic**
- Docs: https://docs.anthropic.com
- Pricing: https://www.anthropic.com/pricing
- Console: https://console.anthropic.com

### **Exemples de prompts**
- https://platform.openai.com/examples
- https://docs.anthropic.com/claude/prompt-library

---

## 💡 BONNES PRATIQUES

### **Sécurité**

1. **Ne JAMAIS partager votre API key**
2. **Définir des limites de dépense**
3. **Surveiller l'usage régulièrement**
4. **Révoquer les clés non utilisées**

### **Performance**

1. **Cacher les réponses fréquentes**
2. **Utiliser le modèle adapté**
3. **Limiter longueur des prompts**
4. **Batching des requêtes**

### **Coûts**

1. **Commencer avec GPT-3.5 ou Claude Haiku**
2. **Tester avant de passer à GPT-4**
3. **Surveiller usage hebdomadaire**
4. **Optimiser prompts régulièrement**

---

## ✅ CHECKLIST FINALE

### **OpenAI**
- [ ] Compte créé
- [ ] Carte bancaire ajoutée
- [ ] API key générée
- [ ] Clé copiée sécurisée
- [ ] Limite mensuelle définie ($20)
- [ ] Configuration app testée
- [ ] Premier prompt testé

### **Anthropic**
- [ ] Compte créé
- [ ] Crédits achetés ($20)
- [ ] API key générée
- [ ] Clé copiée sécurisée
- [ ] Configuration app testée
- [ ] Premier prompt testé

### **App**
- [ ] Provider sélectionné
- [ ] API key entrée
- [ ] Modèle choisi
- [ ] Test connexion OK
- [ ] Assistant IA accessible
- [ ] Prompt test réussi
- [ ] Coût affiché correctement

---

**C'est prêt ! L'IA réelle est activée ! 🤖🚀**

*Budget recommandé pour démarrer: $10-20/mois*
*Modèle recommandé: Claude 3 Sonnet (meilleur rapport qualité/prix)*
