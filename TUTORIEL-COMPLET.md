# 📚 TUTORIEL COMPLET - GÎTE MASTER v2.0

## 🎯 GUIDE UTILISATEUR ILLUSTRÉ

---

## 📋 TABLE DES MATIÈRES

1. [Premier Démarrage](#premier-démarrage)
2. [Onboarding Guidé](#onboarding-guidé)
3. [Dashboard](#dashboard)
4. [Gestion Réservations](#gestion-réservations)
5. [Assistant IA](#assistant-ia)
6. [Messagerie Automatique](#messagerie-automatique)
7. [Ménage & Opérations](#ménage--opérations)
8. [Comptabilité](#comptabilité)
9. [Multi-Propriétés](#multi-propriétés)
10. [Pages Publiques](#pages-publiques)
11. [Configuration Admin](#configuration-admin)
12. [Intégrations](#intégrations)

---

## 🚀 PREMIER DÉMARRAGE

### **Étape 1: Ouvrir l'application**

```
http://localhost:5173
(ou votre URL de production)
```

### **Étape 2: Page de connexion**

```
┌────────────────────────────────────────────┐
│                                            │
│         🏠 GÎTE MASTER                     │
│    Gestion Locations Saisonnières          │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Identifiant                         │ │
│  │  [admin___________________]          │ │
│  │                                      │ │
│  │  Mot de passe                        │ │
│  │  [●●●●●●●_______________]           │ │
│  │                                      │ │
│  │         [Se connecter]               │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Identifiants par défaut:                 │
│  • Login: admin                           │
│  • Password: admin123                     │
└────────────────────────────────────────────┘
```

**Actions:**
1. Entrer `admin`
2. Entrer `admin123`
3. Cliquer "Se connecter"

---

## 🎨 ONBOARDING GUIDÉ

### **Premier lancement = Wizard automatique**

```
┌────────────────────────────────────────────┐
│  ✨ Bienvenue sur Gîte Master ! 🎉        │
│  Configurons votre première propriété       │
│  en 5 minutes                              │
│                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ████████████░░░░░░░░░░░░░░░░░░░░ 40%     │
│                                            │
│  Étape 2 sur 5 • Localisation             │
└────────────────────────────────────────────┘
```

### **Étape 1/5: Informations de base**

```
┌────────────────────────────────────────────┐
│  🏠 Votre propriété                        │
│  Comment s'appelle votre bien ?            │
│                                            │
│  Nom de la propriété *                     │
│  [Villa Sunset________________]            │
│                                            │
│  Type de bien                              │
│  ┌────┬────┬────┬────┬────┐              │
│  │ 🏠 │ 🏢 │ 🏡 │ 🛏️ │ 🏘️ │              │
│  │Villa│Appt│Gîte│Chbr│Stud│              │
│  └────┴────┴────┴────┴────┘              │
│                                            │
│         [← Précédent]  [Suivant →]        │
└────────────────────────────────────────────┘
```

**Champs à remplir:**
- ✅ Nom propriété (obligatoire)
- ✅ Type (villa, appart, gîte, chambre, studio)

### **Étape 2/5: Localisation**

```
┌────────────────────────────────────────────┐
│  📍 Localisation                           │
│  Où se trouve votre bien ?                 │
│                                            │
│  Adresse                                   │
│  [123 Rue de la Plage_______]             │
│                                            │
│  Ville *          Code postal *            │
│  [Nice______]     [06000__]                │
│                                            │
│  Pays                                      │
│  [France_____________________]             │
│                                            │
│         [← Précédent]  [Suivant →]        │
└────────────────────────────────────────────┘
```

**Champs à remplir:**
- ✅ Ville (obligatoire)
- ✅ Code postal (obligatoire)
- Adresse (optionnel)
- Pays (pré-rempli: France)

### **Étape 3/5: Capacité**

```
┌────────────────────────────────────────────┐
│  👥 Capacité                               │
│  Combien de personnes pouvez-vous          │
│  accueillir ?                              │
│                                            │
│  ┌─────────────┐  ┌─────────────┐        │
│  │ 👥 Voyageurs│  │ 🛏️ Chambres │        │
│  │      4      │  │      2      │        │
│  │   [- | +]   │  │   [- | +]   │        │
│  └─────────────┘  └─────────────┘        │
│                                            │
│  ┌─────────────┐  ┌─────────────┐        │
│  │ 🛌 Lits     │  │ 🚿 SdB      │        │
│  │      2      │  │      1      │        │
│  │   [- | +]   │  │   [- | +]   │        │
│  └─────────────┘  └─────────────┘        │
│                                            │
│         [← Précédent]  [Suivant →]        │
└────────────────────────────────────────────┘
```

**Champs à remplir:**
- Voyageurs max (compteur +/-)
- Chambres (compteur +/-)
- Lits (compteur +/-)
- Salles de bain (compteur +/-)

### **Étape 4/5: Tarification**

```
┌────────────────────────────────────────────┐
│  💰 Tarification                           │
│  Définissez vos prix de base               │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  💰 Prix par nuit *                  │ │
│  │                                      │ │
│  │         120         €                │ │
│  │                                      │ │
│  │  Prix moyen recommandé: 80-150€     │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  🧹 Frais de ménage                  │ │
│  │         50          €                │ │
│  │  Montant unique par séjour           │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  💡 Vous pourrez ajuster par saison       │
│                                            │
│         [← Précédent]  [Suivant →]        │
└────────────────────────────────────────────┘
```

**Champs à remplir:**
- ✅ Prix/nuit (obligatoire)
- Frais ménage (optionnel)

### **Étape 5/5: Accès & WiFi**

```
┌────────────────────────────────────────────┐
│  🔑 Accès & WiFi                           │
│  Informations pratiques (optionnel)        │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  📡 WiFi                             │ │
│  │  Réseau: [Villa-WiFi_______]        │ │
│  │  Mot de passe: [Bienvenue2025!___]  │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌────────────┐  ┌────────────┐          │
│  │ 🚪 Portail │  │ 🔑 Clés    │          │
│  │  [1234A_]  │  │  [5678__]  │          │
│  └────────────┘  └────────────┘          │
│                                            │
│  ⚠️ Modifiable dans Admin → Propriétés    │
│                                            │
│         [← Précédent]  [✓ Terminer]       │
└────────────────────────────────────────────┘
```

**Champs à remplir (tous optionnels):**
- WiFi SSID
- WiFi password
- Code portail
- Code boîte à clés

### **Confirmation**

```
┌────────────────────────────────────────────┐
│                                            │
│              ✅ Propriété créée !          │
│                                            │
│         Villa Sunset, Nice                 │
│         4 personnes • 2 chambres           │
│         120€/nuit + 50€ ménage             │
│                                            │
│     Vous allez être redirigé vers le       │
│              Dashboard...                   │
│                                            │
└────────────────────────────────────────────┘
```

---

## 📊 DASHBOARD

### **Vue d'ensemble**

```
┌────────────────────────────────────────────────────────────────┐
│  📊 Gîte Master                           [Aide] [@]           │
├────────────────────────────────────────────────────────────────┤
│  [Dashboard] Calendrier  Messagerie  Ménage  Compta  Admin ... │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────┬─────────┬─────────┬─────────┐                   │
│  │ 💰 2,450€│ 📅 12   │ 📈 85%  │ ⭐ 4.8  │                   │
│  │ Ce mois  │ Résas   │ Taux    │ Note    │                   │
│  │ +15% ↑   │ +3 ↑    │ +5% ↑   │ 127avis │                   │
│  └─────────┴─────────┴─────────┴─────────┘                   │
│                                                                │
│  📈 Revenus mensuels                                          │
│  ┌────────────────────────────────────────┐                  │
│  │    █                                   │                  │
│  │  █ █     █                             │                  │
│  │█ █ █ █ █ █ █ █                         │                  │
│  │Jan Fév Mar Avr Mai Jun Jul Aoû Sep Oct │                  │
│  └────────────────────────────────────────┘                  │
│  Cliquez sur un mois pour voir détails                        │
│                                                                │
│  📅 Prochaines réservations                                   │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Marie Dubois • Villa Sunset • 15-22 Juil • ✅ Confirmée  ││
│  │ Jean Martin  • Villa Sunset • 25-30 Juil • ⏳ En attente ││
│  │ Sophie Blanc • Villa Sunset • 01-08 Août • ✅ Confirmée  ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
│  ⚠️ Tâches urgentes                                           │
│  • Ménage après départ Marie (22 Juil 14h)                    │
│  • Répondre à demande info Jean Martin                        │
│                                                                │
│  🚀 Actions rapides                                           │
│  ┌────────┬────────┬────────┬────────┐                       │
│  │🤖 IA   │📅 Résa │💬 Msg  │📊 Stats│                       │
│  │Assistant│Nouvelle│Clients │Détails │                       │
│  └────────┴────────┴────────┴────────┘                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Éléments cliquables:**
1. **KPIs** (4 cartes en haut) → Redirige vers modules
2. **Graphique mois** → Modal détails mois
3. **Réservations** → Calendrier
4. **Tâches urgentes** → Module ménage
5. **Boutons rapides** → Modules correspondants

---

## 📅 GESTION RÉSERVATIONS

### **Calendrier mensuel**

```
┌────────────────────────────────────────────────────────────────┐
│  📅 Calendrier                                                 │
│  [Nouvelle réservation]                 Juillet 2025    [< >] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Villa Sunset [▼]  (Changer de propriété)                     │
│                                                                │
│  Lun  Mar  Mer  Jeu  Ven  Sam  Dim                           │
│   -    1    2    3    4    5    6                             │
│   7    8    9   10   11   12   13                             │
│  14  ┌──────────────────────┐  20                             │
│  15  │ Marie D. • 4 pers   │  21                             │
│  16  │ 15-22 Juil • 840€   │  22                             │
│  17  │ ✅ Confirmée        │  23                             │
│  18  └──────────────────────┘  24                             │
│  19                                25  ┌──────────┐           │
│  26                                27  │ Jean M.  │           │
│  28                                29  │ 25-30    │           │
│  30                                31  └──────────┘           │
│                                                                │
│  Légende:                                                     │
│  ✅ Confirmée  ⏳ En attente  ❌ Annulée  🏠 En cours         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Interactions:**
1. Clic sur réservation → Modal détails
2. Clic "Nouvelle réservation" → Formulaire
3. Flèches < > → Changer de mois
4. Menu déroulant → Changer propriété

### **Nouvelle réservation**

```
┌────────────────────────────────────────────┐
│  ➕ Nouvelle réservation                   │
│                                            │
│  Propriété                                 │
│  [Villa Sunset ▼]                         │
│                                            │
│  👤 Informations voyageur                  │
│  Nom *        [Marie Dubois_______]       │
│  Email *      [marie@email.com____]       │
│  Téléphone    [+33 6 12 34 56 78__]       │
│                                            │
│  📅 Dates                                  │
│  Arrivée *    [15/07/2025]  [📅]          │
│  Départ *     [22/07/2025]  [📅]          │
│               7 nuits                      │
│                                            │
│  👥 Voyageurs                              │
│  Adultes      [2] [+][-]                  │
│  Enfants      [2] [+][-]                  │
│  Total: 4 personnes                        │
│                                            │
│  💰 Tarification                           │
│  7 nuits × 120€        840€               │
│  Frais ménage           50€               │
│  Taxe séjour (4p×7n)    22€               │
│  ─────────────────────────                │
│  TOTAL                 912€               │
│                                            │
│  📝 Notes (optionnel)                      │
│  [Arrivée tardive 21h_______]             │
│                                            │
│  Source                                    │
│  ○ Direct  ● Airbnb  ○ Booking  ○ Manuel │
│                                            │
│  ✅ Créer tâche ménage automatique        │
│                                            │
│     [Annuler]         [Enregistrer]       │
└────────────────────────────────────────────┘
```

**Calcul automatique:**
- Prix total = (nuits × prix/nuit) + ménage + taxe
- Taxe séjour = personnes × nuits × 0.80€
- Tâche ménage créée auto si coché

### **Détails réservation**

```
┌────────────────────────────────────────────┐
│  📋 Réservation #RES001                    │
│                                            │
│  ✅ Confirmée                              │
│  Source: Airbnb                            │
│                                            │
│  👤 Voyageur                               │
│  Marie Dubois                              │
│  marie@email.com                           │
│  +33 6 12 34 56 78                         │
│                                            │
│  🏠 Propriété                              │
│  Villa Sunset, Nice                        │
│                                            │
│  📅 Séjour                                 │
│  Du 15/07/2025 au 22/07/2025              │
│  7 nuits • 4 personnes (2A + 2E)          │
│                                            │
│  💰 Montant                                │
│  Prix séjour:    840€                      │
│  Frais ménage:    50€                      │
│  Taxe séjour:     22€                      │
│  ──────────────────                        │
│  Total:          912€  ✅ Payé            │
│                                            │
│  📝 Notes                                  │
│  Arrivée tardive prévue vers 21h          │
│                                            │
│  🗓️ Tâches liées                          │
│  • Ménage programmé 22/07 14h00           │
│  • Message J-3 envoyé 12/07               │
│                                            │
│  [Modifier] [Envoyer message] [Supprimer] │
│                         [Fermer]           │
└────────────────────────────────────────────┘
```

---

## 🤖 ASSISTANT IA

### **Ouverture**

```
Dashboard → Clic "🤖 Assistant IA"
```

### **Interface principale**

```
┌────────────────────────────────────────────────────────────────┐
│  🤖 Assistant IA                                          [×]  │
│  Propulsé par Claude 3 Sonnet • IA Réelle                     │
├────────────────────────────────────────────────────────────────┤
│  🚀 Suggestions rapides:                                       │
│  [📝 Message bienvenue] [💰 Prix] [✍️ Description] [🤖 Auto] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  (Zone de réponse - vide au départ)                           │
│                                                                │
│                                                                │
│                                                                │
│                                                                │
│                                                                │
│                                                                │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  Votre question:                                               │
│  [Rédige un message de bienvenue pour Marie...____] [Envoyer] │
│  ✅ IA activée: anthropic (claude-3-sonnet-20240229)          │
└────────────────────────────────────────────────────────────────┘
```

### **Exemple: Message bienvenue**

**1. Clic sur "📝 Message bienvenue"**

```
┌────────────────────────────────────────────────────────────────┐
│  🤖 L'assistant réfléchit...                                   │
│  ⏳ [spinner]                                                  │
└────────────────────────────────────────────────────────────────┘
```

**2. Réponse (effet typing)**

```
┌────────────────────────────────────────────────────────────────┐
│  📧 Message de Bienvenue Suggéré                               │
│                                                                │
│  Bonjour Marie ! 👋                                            │
│                                                                │
│  Nous sommes ravis de vous accueillir prochainement dans       │
│  notre magnifique Villa Sunset !                               │
│                                                                │
│  📅 Votre séjour: du 15 au 22 juillet 2025                    │
│                                                                │
│  🔑 ACCÈS:                                                     │
│  • Code portail: 1234A                                         │
│  • Code boîte à clés: 5678                                     │
│  • Les clés sont dans la boîte fixée à droite                  │
│                                                                │
│  📡 WIFI:                                                      │
│  • Réseau: Villa-WiFi                                          │
│  • Mot de passe: Bienvenue2025!                                │
│                                                                │
│  Pour toute question: +33 6 12 34 56 78                        │
│                                                                │
│  Au plaisir de vous recevoir ! ✨                              │
│  L'équipe Villa Sunset                                         │
│                                                                │
│  ───────────────────────────────────────────────────────────  │
│  💰 Coût: $0.0082 (245 tokens)                                │
└────────────────────────────────────────────────────────────────┘
```

**3. Actions possibles**
- Copier le texte
- Modifier et renvoyer
- Nouveau prompt

---

## 💬 MESSAGERIE AUTOMATIQUE

### **Accès**

```
Menu → Messagerie
```

### **Interface**

```
┌────────────────────────────────────────────────────────────────┐
│  💬 Messagerie                                                 │
├────────────────────────────────────────────────────────────────┤
│  [Templates] [Historique] [Automatisation]                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📧 Templates de messages                                      │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ ✅ Confirmation réservation                              ││
│  │ Envoyé automatiquement à la réservation                  ││
│  │ [Modifier] [Aperçu] [Test]                               ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ 📅 Infos pré-arrivée (J-3)                               ││
│  │ Codes accès, WiFi, recommandations                       ││
│  │ [Modifier] [Aperçu] [Test]                               ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ 🏠 Message bienvenue (J-0)                               ││
│  │ SMS de bienvenue jour d'arrivée                          ││
│  │ [Modifier] [Aperçu] [Test]                               ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ ⭐ Demande d'avis (J+1)                                  ││
│  │ Feedback après séjour                                    ││
│  │ [Modifier] [Aperçu] [Test]                               ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### **Éditer un template**

```
┌────────────────────────────────────────────┐
│  ✏️ Modifier template                      │
│                                            │
│  Nom du template                           │
│  [Confirmation réservation___]            │
│                                            │
│  Type                                      │
│  ● Email  ○ SMS  ○ Les deux               │
│                                            │
│  Sujet (email)                             │
│  [Réservation confirmée - {property}___]  │
│                                            │
│  Message *                                 │
│  ┌────────────────────────────────────┐  │
│  │Bonjour {guest},                    │  │
│  │                                    │  │
│  │Votre réservation est confirmée !  │  │
│  │                                    │  │
│  │Propriété: {property}               │  │
│  │Dates: {checkin} - {checkout}       │  │
│  │Voyageurs: {guests}                 │  │
│  │Montant: {total}€                   │  │
│  │                                    │  │
│  │À bientôt !                         │  │
│  └────────────────────────────────────┘  │
│                                            │
│  💡 Variables disponibles:                │
│  {guest} {property} {checkin} {checkout}  │
│  {guests} {total} {phone} {wifi} {codes}  │
│                                            │
│  [Aperçu] [Test]        [Sauvegarder]    │
└────────────────────────────────────────────┘
```

### **Automatisation**

```
┌────────────────────────────────────────────┐
│  🤖 Scénarios d'automatisation             │
│                                            │
│  ┌────────────────────────────────────┐  │
│  │ 📧 Confirmation immédiate          │  │
│  │ ✅ Actif                           │  │
│  │ Déclencheur: Nouvelle réservation  │  │
│  │ Action: Email + SMS                │  │
│  │ [Désactiver] [Modifier]            │  │
│  └────────────────────────────────────┘  │
│                                            │
│  ┌────────────────────────────────────┐  │
│  │ 📅 Infos J-3                       │  │
│  │ ✅ Actif                           │  │
│  │ Déclencheur: 3 jours avant arrivée │  │
│  │ Action: Email avec codes accès     │  │
│  │ [Désactiver] [Modifier]            │  │
│  └────────────────────────────────────┘  │
│                                            │
│  [+ Créer un scénario]                    │
└────────────────────────────────────────────┘
```

---

## 🧹 MÉNAGE & OPÉRATIONS

### **Liste des tâches**

```
┌────────────────────────────────────────────────────────────────┐
│  🧹 Ménage & Opérations                                        │
│  [Nouvelle tâche]                     Juillet 2025    [< >]   │
├────────────────────────────────────────────────────────────────┤
│  Filtres: [Toutes ▼] [Propriété ▼] [Status ▼]                │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐│
│  │ ⏳ En attente • Marie Dubois • Villa Sunset              ││
│  │ 22 Juillet 2025 • 14:00                                  ││
│  │ Après départ 7 nuits • Ménage complet                    ││
│  │ [Assigner] [Démarrer] [Détails]                          ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ 👤 Assigné • Jean Martin • Villa Sunset                  ││
│  │ 30 Juillet 2025 • 14:00                                  ││
│  │ Agent: Sophie • Coût: 80€                                ││
│  │ [Contacter] [Détails]                                    ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ ✅ Terminé • Claire Petit • Villa Sunset                 ││
│  │ 15 Juillet 2025 • Durée: 2h                              ││
│  │ Agent: Sophie • Qualité: ⭐⭐⭐⭐⭐                      ││
│  │ [Voir rapport]                                           ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### **Détails tâche**

```
┌────────────────────────────────────────────┐
│  🧹 Tâche #CLEAN001                        │
│                                            │
│  ⏳ En attente                             │
│                                            │
│  📅 Planification                          │
│  Date: 22 Juillet 2025                     │
│  Heure: 14:00                              │
│  Durée estimée: 2h                         │
│                                            │
│  🏠 Propriété                              │
│  Villa Sunset, Nice                        │
│                                            │
│  📋 Après réservation                      │
│  Marie Dubois • 15-22 Juil (7 nuits)      │
│                                            │
│  ✓ Checklist                               │
│  □ Changer draps et serviettes             │
│  □ Aspirer et laver sols                   │
│  □ Nettoyer salle de bain                  │
│  □ Nettoyer cuisine                        │
│  □ Vider poubelles                         │
│  □ Vérifier stocks (PQ, savon)            │
│                                            │
│  👤 Assignation                            │
│  Agent: [Non assigné ▼]                   │
│  Téléphone: [___________]                  │
│  Coût: [80___]€                            │
│                                            │
│  📝 Notes                                  │
│  [Attention: voyageurs avaient un chien]  │
│                                            │
│  [Assigner] [Envoyer SMS] [Supprimer]     │
│                      [Fermer]              │
└────────────────────────────────────────────┘
```

---

## 💰 COMPTABILITÉ

### **Tableau de bord compta**

```
┌────────────────────────────────────────────────────────────────┐
│  💰 Comptabilité & Finances                                    │
│  Juillet 2025                                          [< >]   │
├────────────────────────────────────────────────────────────────┤
│  ┌─────────┬─────────┬─────────┬─────────┐                   │
│  │ 💵 Revenu│ 💸 Dépense│📊 Net  │ 📈 Marge│                   │
│  │  2,450€  │   650€   │ 1,800€ │  73%   │                   │
│  └─────────┴─────────┴─────────┴─────────┘                   │
│                                                                │
│  📊 Répartition dépenses                                       │
│  ┌────────────────────────────────────────┐                  │
│  │ 🧹 Ménage          320€  ████████░░    │                  │
│  │ 🔧 Maintenance     150€  ████░░░░░░    │                  │
│  │ 🛒 Fournitures      80€  ██░░░░░░░░    │                  │
│  │ 💡 Électricité      60€  ██░░░░░░░░    │                  │
│  │ 💰 Taxe séjour      40€  █░░░░░░░░░    │                  │
│  └────────────────────────────────────────┘                  │
│                                                                │
│  💵 Revenus (5 réservations)                                  │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ 15-22 Jul • Marie D.  • 7n × 120€      840€  ✅ Payé    ││
│  │ 25-30 Jul • Jean M.   • 5n × 120€      600€  ⏳ Attente ││
│  │ 01-08 Aug • Sophie B. • 7n × 120€      840€  ✅ Payé    ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
│  💸 Dépenses (8 opérations)                [+ Ajouter]        │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ 22 Jul • Ménage Sophie         80€   🧹 Ménage          ││
│  │ 18 Jul • Plombier (fuite)     150€   🔧 Maintenance     ││
│  │ 15 Jul • Draps neufs           60€   🛒 Fournitures     ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
│  [Export Excel] [Imprimer rapport]                            │
└────────────────────────────────────────────────────────────────┘
```

### **Ajouter une dépense**

```
┌────────────────────────────────────────────┐
│  ➕ Nouvelle dépense                       │
│                                            │
│  Date *                                    │
│  [18/07/2025] [📅]                        │
│                                            │
│  Catégorie *                               │
│  [Maintenance ▼]                          │
│                                            │
│  Montant * (€)                             │
│  [150___]                                  │
│                                            │
│  Description *                             │
│  [Réparation fuite salle de bain___]      │
│                                            │
│  Fournisseur                               │
│  [Plombier Martin_______]                  │
│                                            │
│  Propriété                                 │
│  [Villa Sunset ▼]                         │
│                                            │
│  📎 Facture (optionnel)                    │
│  [Parcourir fichier]                       │
│                                            │
│     [Annuler]         [Enregistrer]       │
└────────────────────────────────────────────┘
```

---

## 🏠 MULTI-PROPRIÉTÉS

### **Gestion propriétés**

```
Admin → Propriétés
```

```
┌────────────────────────────────────────────────────────────────┐
│  🏠 Mes Propriétés                         [+ Nouvelle]        │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐│
│  │ 🏠 Villa Sunset                              ✅ Active   ││
│  │ Nice, 06000 • 4 personnes • 2 chambres                  ││
│  │ 120€/nuit • Taux occupation: 85%                        ││
│  │ [Modifier] [Dupliquer] [Désactiver]                     ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ 🏢 Appartement Cosy                          ⏸️ Pause   ││
│  │ Cannes, 06400 • 2 personnes • 1 chambre                 ││
│  │ 80€/nuit • Taux occupation: 0% (pausé)                  ││
│  │ [Modifier] [Activer]                                    ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
│  Statistiques globales                                         │
│  • 2 propriétés actives                                       │
│  • Capacité totale: 6 personnes                               │
│  • Revenus ce mois: 3,200€                                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### **Éditer propriété**

```
┌────────────────────────────────────────────┐
│  ✏️ Villa Sunset                           │
│  [Général] [Tarifs] [Accès] [Photos]      │
├────────────────────────────────────────────┤
│  📋 Informations générales                 │
│                                            │
│  Nom *                                     │
│  [Villa Sunset_________________]          │
│                                            │
│  Type                                      │
│  [Villa ▼]                                │
│                                            │
│  📍 Adresse                                │
│  Rue      [123 Rue de la Plage____]       │
│  Ville    [Nice________] CP [06000___]    │
│  Pays     [France______________]          │
│                                            │
│  👥 Capacité                               │
│  Voyageurs [4] Chambres [2]               │
│  Lits      [2] SdB      [1]               │
│                                            │
│  📝 Description                            │
│  Courte (meta 160 char)                    │
│  [Villa moderne avec piscine___]          │
│                                            │
│  Longue (SEO)                              │
│  ┌────────────────────────────────────┐  │
│  │Magnifique villa avec vue mer...   │  │
│  └────────────────────────────────────┘  │
│                                            │
│  ✨ Équipements                            │
│  ☑ WiFi  ☑ Piscine  ☑ Parking            │
│  ☑ Clim  ☐ Jacuzzi  ☐ Sauna              │
│                                            │
│  [Annuler]             [Sauvegarder]      │
└────────────────────────────────────────────┘
```

---

## 🌐 PAGES PUBLIQUES

### **1. Livret Voyageur (Guest Guide)**

**Accès:** `/#guest-guide`

```
┌────────────────────────────────────────────────────────────────┐
│                    🏠 VILLA SUNSET                             │
│              Bienvenue ! Voici toutes les infos                │
│                    pour votre séjour                            │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  ℹ️ INFORMATIONS ESSENTIELLES              │
│                                            │
│  ⏰ Arrivée: À partir de 16:00            │
│  ⏰ Départ: Avant 11:00                    │
│                                            │
│  📞 Votre hôte: Marie                     │
│  ☎️  +33 6 12 34 56 78                    │
│                                            │
│  🚨 Urgences: 15 (Médecin) 17 (Police)    │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  🔑 ACCÈS AU LOGEMENT                      │
│                                            │
│  📍 Adresse                                │
│  123 Rue de la Plage, 06000 Nice          │
│  [Ouvrir dans Google Maps →]              │
│                                            │
│  🚪 Code Portail      🔑 Code Boîte       │
│      1234A                5678            │
│                                            │
│  Instructions:                             │
│  Le portail est à gauche, la boîte à      │
│  clés sur le mur à droite                 │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  📡 WIFI                                   │
│  Réseau: Villa-Sunset-WiFi                 │
│  Mot de passe: Bienvenue2025!              │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  🍴 ÉQUIPEMENTS                            │
│  ✅ Cuisine équipée complète               │
│  ✅ TV connectée Netflix                   │
│  ✅ Climatisation                          │
│  ✅ Machine à laver                        │
│  ✅ Piscine chauffée                       │
│  ✅ Parking privé 2 places                 │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  📋 MODE D'EMPLOI                          │
│  1️⃣ Chauffage/Clim: Télécommande          │
│     dans chaque pièce, 21°C recommandé     │
│  2️⃣ WiFi: Nom et mot de passe affichés   │
│  3️⃣ TV: SOURCE → HDMI                     │
│  4️⃣ Machine: Programme Coton 40°          │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  🌴 À DÉCOUVRIR                            │
│  🏖️  Plage • 15min à pied                 │
│  🍴 Restaurant Le Bistrot • 5min          │
│  🛒 Super U • 10min                        │
│  🎭 Vieux Nice • 20min                     │
│  ⛰️  Mont Boron • 30min                    │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  ⚠️ RÈGLEMENT                              │
│  • Non fumeur (intérieur)                  │
│  • Animaux non acceptés                    │
│  • Silence 22h-8h                          │
│  • Maximum 6 voyageurs                     │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  ✅ CHECK-OUT CHECKLIST                    │
│  □ Fermer portes et fenêtres              │
│  □ Éteindre lumières                       │
│  □ Éteindre chauffage/clim                 │
│  □ Déposer clés dans boîte                │
│  □ Sortir poubelles                        │
│  □ Fermer portail                          │
└────────────────────────────────────────────┘

     ✨ Excellent séjour ! ✨
    Généré par Gîte Master
```

### **2. Rapport Ménage (Cleaning Report)**

**Accès:** `/#cleaning-report`

```
┌────────────────────────────────────────────┐
│  🧹 RAPPORT DE MÉNAGE                      │
│  Remplissez ce formulaire après votre      │
│  intervention                               │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  🏠 Villa Sunset                           │
│  123 Rue de la Plage, Nice                 │
│  Date: 22/07/2025  Heure: 14:00           │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  👤 VOS INFORMATIONS                       │
│  Nom *        [Sophie Martin_____]         │
│  Durée (min)  [120___]                     │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  📊 PROGRESSION: 50%                       │
│  ██████████████████░░░░░░░░░░░░░░         │
│  4 sur 8 tâches complétées                 │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  ✓ CHECKLIST DES TÂCHES                    │
│  (Cliquez pour cocher)                     │
│                                            │
│  ☑ Changer les draps                       │
│  ☑ Aspirer et laver le sol                 │
│  ☑ Nettoyer salle de bain                  │
│  ☑ Nettoyer cuisine                        │
│  □ Vider les poubelles                     │
│  □ Vérifier stocks (PQ, savon)            │
│  □ Nettoyer vitres                         │
│  □ Dépoussiérer meubles                    │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  📸 PHOTOS (optionnel)                     │
│  Prenez quelques photos du travail         │
│                                            │
│  [📷 photo1] [📷 photo2]                  │
│                                            │
│  [Ajouter des photos]                      │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  ⚠️ PROBLÈMES RENCONTRÉS                   │
│  ┌────────────────────────────────────┐  │
│  │Ampoule grillée salle de bain      │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  📝 NOTES ADDITIONNELLES                   │
│  ┌────────────────────────────────────┐  │
│  │Tout s'est bien passé, propriété   │  │
│  │bien entretenue                     │  │
│  └────────────────────────────────────┘  │
└────────────────────────────────────────────┘

     [📤 ENVOYER LE RAPPORT]
```

**Après envoi:**

```
┌────────────────────────────────────────────┐
│            ✅ Rapport envoyé !             │
│                                            │
│  Merci Sophie pour votre travail soigné.  │
│  Le rapport a été transmis au propriétaire.│
│                                            │
│  • 4/8 tâches complétées                  │
│  • 2 photo(s) ajoutée(s)                   │
│  • Durée: 120 minutes                      │
│                                            │
│         [Nouveau rapport]                  │
└────────────────────────────────────────────┘
```

---

## ⚙️ CONFIGURATION ADMIN

### **Accès**

```
Menu → Admin
```

### **Onglets disponibles**

```
[Général] [Propriétés] [Tarification] [Liens Avis] 
[API & Envois] [Intégrations] [Sécurité] [Données]
```

### **Onglet: API & Envois**

```
┌────────────────────────────────────────────┐
│  📧 SENDGRID - Emails automatiques         │
│                                            │
│  API Key                                   │
│  [SG.xxxxxxxxxxxxxx__________]            │
│                                            │
│  Email expéditeur                          │
│  [contact@villa-sunset.com____]           │
│                                            │
│  Nom expéditeur                            │
│  [Villa Sunset_________________]          │
│                                            │
│  [Tester connexion]                        │
│  ✅ SendGrid configuré                     │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  📱 TWILIO - SMS automatiques              │
│                                            │
│  Account SID                               │
│  [ACxxxxxxxxxxxxxx_________]              │
│                                            │
│  Auth Token                                │
│  [●●●●●●●●●●●●●●●●●●●●____]              │
│                                            │
│  Numéro Twilio                             │
│  [+33 7 56 78 90 12________]              │
│                                            │
│  [Tester connexion]                        │
│  ✅ Twilio configuré                       │
└────────────────────────────────────────────┘
```

---

## 🔌 INTÉGRATIONS

### **Onglet: Intégrations**

```
Admin → Intégrations
```

### **Supabase (Base de données)**

```
┌────────────────────────────────────────────┐
│  🗄️ SUPABASE - Base de données cloud      │
│                                            │
│  URL du projet                             │
│  [https://xxx.supabase.co______]          │
│                                            │
│  Anon Key (public)                         │
│  [eyJhbGciOi●●●●●●●●●●●●●●●●●]           │
│                                            │
│  [Tester] [Migrer depuis localStorage]    │
│  ✅ Supabase configuré                     │
│                                            │
│  📋 Setup Supabase:                        │
│  1. Créer projet sur supabase.com         │
│  2. Créer tables (SQL fourni)             │
│  3. Copier URL + anon key                 │
│  4. Tester connexion                       │
│  5. Migrer données                         │
└────────────────────────────────────────────┘
```

### **Stripe (Paiements)**

```
┌────────────────────────────────────────────┐
│  💳 STRIPE - Paiements & Cautions          │
│                                            │
│  Publishable Key (public)                  │
│  [pk_test_●●●●●●●●●●●●●●●●●●]           │
│                                            │
│  [Tester] [Voir cartes test]              │
│  ✅ Stripe configuré                       │
│                                            │
│  📋 Setup Stripe:                          │
│  1. Créer compte stripe.com               │
│  2. Activer mode test                      │
│  3. Copier Publishable Key                │
│  4. Configurer webhook (optionnel)        │
│  5. Tester avec cartes test               │
│                                            │
│  🎯 Fonctionnalités:                       │
│  • Paiements one-time                      │
│  • Cautions (hold + release)              │
│  • Paiements complémentaires              │
│  • Liens de paiement                       │
│  • Webhooks événements                     │
└────────────────────────────────────────────┘
```

### **Intelligence Artificielle**

```
┌────────────────────────────────────────────┐
│  🤖 IA - Assistant intelligent             │
│                                            │
│  Provider                                  │
│  [Anthropic (Claude) ▼]                   │
│                                            │
│  API Key                                   │
│  [sk-ant-●●●●●●●●●●●●●●●●●●]            │
│                                            │
│  Modèle                                    │
│  [Claude 3 Sonnet ▼]                      │
│                                            │
│  [Tester] [Voir modèles & prix]           │
│  ✅ IA activée: anthropic (sonnet)        │
│                                            │
│  📋 Setup IA:                              │
│  1. Créer compte OpenAI ou Anthropic      │
│  2. Générer API key                        │
│  3. Copier clé ici                         │
│  4. Choisir modèle                         │
│  5. Tester connexion                       │
│                                            │
│  🎯 Fonctionnalités:                       │
│  • Messages de bienvenue                   │
│  • Descriptions propriétés SEO            │
│  • Suggestions prix dynamiques            │
│  • Scénarios automatisation               │
│  • Analyse données réservations           │
│                                            │
│  💰 Coût: ~$2-5/mois (usage normal)       │
└────────────────────────────────────────────┘
```

---

## 📊 RÉCAPITULATIF WORKFLOW COMPLET

### **Scénario: Nouvelle réservation → Séjour → Après-séjour**

```
1. 📅 RÉSERVATION
   └─→ Calendrier → Nouvelle réservation
       ├─ Remplir formulaire
       ├─ Calcul auto prix + taxe
       └─ ✅ Enregistrer
           └─→ 📧 Email confirmation AUTO
           └─→ 📱 SMS confirmation AUTO
           └─→ 🧹 Tâche ménage créée AUTO (J départ+2h)

2. 📧 J-3 AVANT ARRIVÉE
   └─→ 📧 Email auto avec codes accès
   └─→ 📱 SMS rappel

3. 📱 JOUR ARRIVÉE (J-0)
   └─→ 📱 SMS bienvenue
   └─→ 🌐 Lien guest-guide envoyé
       (voyageur accède à toutes les infos)

4. 🏠 PENDANT SÉJOUR
   └─→ Tout est dans le guest-guide
   └─→ Support 24/7 si besoin

5. 📱 J-1 AVANT DÉPART
   └─→ 📱 SMS rappel check-out
   └─→ Instructions de sortie

6. 🧹 JOUR DÉPART
   └─→ Notification agent ménage
   └─→ 📱 SMS avec lien rapport ménage
   └─→ Agent remplit rapport sur mobile
       ├─ Checklist
       ├─ Photos
       ├─ Problèmes signalés
       └─ ✅ Rapport envoyé

7. ⭐ J+1 APRÈS DÉPART
   └─→ 📧 Email demande d'avis
   └─→ Liens Google/Airbnb/Booking

8. 💰 COMPTABILITÉ
   └─→ Revenus enregistrés auto
   └─→ Dépenses ménage ajoutées
   └─→ Calcul taxe séjour
   └─→ Rapport mensuel dispo
```

---

## 🎯 CHECKLIST MISE EN ROUTE

### **Configuration initiale (30 min)**

```
□ 1. Premier login (admin/admin123)
□ 2. Onboarding: Créer 1ère propriété
□ 3. Admin → Sécurité: Changer identifiants
□ 4. Admin → Propriétés: Compléter infos
□ 5. Admin → API: Configurer SendGrid (opt)
□ 6. Admin → API: Configurer Twilio (opt)
□ 7. Admin → Intégrations: Supabase (opt)
□ 8. Admin → Intégrations: Stripe (opt)
□ 9. Admin → Intégrations: IA (opt)
□ 10. Messagerie: Personnaliser templates
```

### **Utilisation quotidienne (10 min/jour)**

```
□ Dashboard: Vérifier KPIs
□ Calendrier: Nouvelles réservations
□ Ménage: Assigner tâches
□ Messagerie: Vérifier envois
□ Comptabilité: Ajouter dépenses
```

### **Hebdomadaire (30 min)**

```
□ Comptabilité: Vérifier revenus/dépenses
□ Propriétés: Mettre à jour infos/photos
□ Messagerie: Optimiser templates
□ Admin → Données: Export backup
```

---

## 💡 ASTUCES & BONNES PRATIQUES

### **Productivité**

1. **Utilisez l'Assistant IA** pour gagner du temps sur:
   - Rédaction messages
   - Descriptions propriétés
   - Analyses données

2. **Automatisez tout** avec les scénarios:
   - Confirmations
   - Rappels
   - Demandes d'avis

3. **Centralisez** dans une seule app:
   - Toutes propriétés
   - Toutes réservations
   - Toute la compta

### **Optimisation revenus**

1. **Ajustez les prix** selon:
   - Saison (haute/basse)
   - Événements locaux
   - Taux d'occupation

2. **Réduisez les commissions**:
   - Réservations directes via site
   - Guest-guide avec QR code
   - Fidélisation clients

3. **Suivez les KPIs**:
   - Taux occupation
   - Panier moyen
   - Marge nette

### **Satisfaction clients**

1. **Communication proactive**:
   - Infos J-3
   - Guide complet
   - Disponibilité 24/7

2. **Expérience premium**:
   - Guest-guide numérique
   - Recommandations locales
   - Réactivité

3. **Collectez les avis**:
   - Demande J+1 automatique
   - Liens directs
   - Suivi

---

## 🆘 SUPPORT

### **Problèmes courants**

**1. Données perdues après refresh**
→ Solution: Admin → Intégrations → Supabase (migration)

**2. Emails pas envoyés**
→ Solution: Vérifier config SendGrid

**3. IA ne répond pas**
→ Solution: Vérifier API key + crédit

**4. Page publique ne s'affiche pas**
→ Solution: Vérifier URL avec `/#guest-guide`

### **Ressources**

- 📚 README.md (documentation technique)
- 🔧 SETUP-SUPABASE-STRIPE.md (intégrations)
- 🤖 SETUP-IA-GUIDE.md (assistant IA)
- 💬 Aide intégrée (bouton "Aide" dans l'app)

---

**Bon succès avec Gîte Master ! 🚀**

*Version 2.0 • Made with ❤️ for property managers*
