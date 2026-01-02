# 🏠 Gîte Master - Gestion de Locations Saisonnières

[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/votre-username/gite-master)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Status](https://img.shields.io/badge/status-production%20ready-success)](https://github.com/votre-username/gite-master)

Application web complète pour gérer vos locations de vacances (gîtes, appartements, villas) avec réservations directes, synchronisation multi-plateformes, et automatisation complète.

![Gîte Master Screenshot](https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop)

---

## ✨ Fonctionnalités Principales

### 🌐 Site Vitrine & Réservations Directes
- 💳 Paiement en ligne sécurisé (Stripe)
- 📅 Calendrier en temps réel avec disponibilités
- 💰 Économisez 15-20% de commissions vs Airbnb/Booking
- 📱 Interface mobile-responsive

### 📊 Gestion Centralisée
- 🗓️ Calendrier unifié toutes plateformes
- 🔄 Synchronisation automatique iCal (Airbnb, Booking, VRBO)
- 📧 Messagerie centralisée (tous vos messages au même endroit)
- 💼 Tableaux de bord avec KPI en temps réel

### 🤖 Automatisation
- 📧 Emails automatiques (confirmation, instructions d'arrivée, avis)
- 📱 SMS automatiques programmables
- ⏰ Déclencheurs personnalisables (J-2, J+1, etc.)
- 🎯 Templates avec variables dynamiques

### 💰 Finance & Comptabilité
- 📈 Suivi revenus/dépenses par propriété
- 🧾 Upload de factures (photo)
- 💸 Calcul automatique de la taxe de séjour
- 📊 Rapports mensuels et déclarations fiscales
- 📉 Marges et rentabilité en temps réel

### 📖 Expérience Voyageur
- 📱 Livret d'accueil numérique
- 🔑 Instructions d'arrivée (codes, clés)
- 📍 Recommandations locales
- 📞 Contacts d'urgence

### 🧹 Gestion Opérationnelle
- ✅ Planning de ménage automatique
- 📦 Gestion des stocks (consommables)
- 🔧 Tickets de maintenance
- 📸 Rapports avec photos

---

## 🚀 Démarrage Rapide

### Installation Express (10 minutes)

```bash
# 1. Cloner le projet
git clone https://github.com/VOTRE_USERNAME/gite-master.git
cd gite-master

# 2. Installer les dépendances
npm install
cd backend && npm install && cd ..

# 3. Configuration
cp .env.example .env.local
cp .env.example backend/.env

# 4. Lancer l'application
npm run dev

# Dans un autre terminal :
cd backend && npm run dev
```

➡️ Ouvrir [http://localhost:3000](http://localhost:3000)

**Login de test :**
- Email : `owner@gitemaster.com`
- Mot de passe : `password123`

📖 **Guide détaillé** : [DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)

---

## 📚 Documentation

| Document | Description | Temps |
|----------|-------------|-------|
| [**DEMARRAGE_RAPIDE.md**](DEMARRAGE_RAPIDE.md) | Démarrage express en 10 minutes | ⚡ 10 min |
| [**INSTALLATION.md**](INSTALLATION.md) | Guide complet pour la production | 📖 1-2h |
| [**PUBLIER_GITHUB.md**](PUBLIER_GITHUB.md) | Publier et déployer sur GitHub/Vercel | 🚀 1h |
| [**README_NOUVEAUTES.md**](README_NOUVEAUTES.md) | Nouveautés version 2.0 | 🆕 10 min |
| [**analyse_modules_manquants.md**](analyse_modules_manquants.md) | Architecture technique | 🏗️ 15 min |

---

## 🛠️ Stack Technique

### Frontend
- **Framework** : React 18 + TypeScript
- **Build** : Vite
- **Styling** : Tailwind CSS
- **Icons** : Lucide React
- **Dates** : date-fns

### Backend
- **Runtime** : Node.js 18+
- **Framework** : Express.js
- **Language** : TypeScript

### Services Tiers
- **Paiements** : Stripe
- **Emails** : SendGrid (100 emails/jour gratuits)
- **SMS** : Twilio
- **Base de données** : PostgreSQL (Supabase)
- **Storage** : Supabase Storage (pour photos)

### Déploiement
- **Frontend** : Vercel (gratuit)
- **Backend** : Railway (gratuit jusqu'à 500h/mois)
- **Base de données** : Supabase (gratuit jusqu'à 500MB)

**💰 Coût total : 0€/mois pour débuter !**

---

## 📦 Structure du Projet

```
gite-master/
├── 📂 src/                      # Frontend React
│   ├── 📂 components/           # Composants UI
│   │   ├── Dashboard.tsx        # Tableau de bord
│   │   ├── CalendarModule.tsx   # Calendrier
│   │   ├── MessagingModule.tsx  # Messagerie
│   │   ├── AccountingModule.tsx # Comptabilité
│   │   ├── PublicBookingEngine.tsx # Site vitrine
│   │   └── TouristTaxReport.tsx # Taxe de séjour
│   │
│   ├── 📂 services/             # Services métier
│   │   ├── stripeService.ts     # Paiements
│   │   ├── emailService.ts      # Emails/SMS
│   │   ├── icalService.ts       # Synchronisation
│   │   └── touristTaxService.ts # Taxe de séjour
│   │
│   └── types.ts                 # Types TypeScript
│
├── 📂 backend/                  # Backend Node.js
│   ├── stripe-api.ts            # API Stripe
│   ├── messaging-api.ts         # API Emails/SMS
│   └── package.json             # Dépendances backend
│
├── 📂 database/                 # Base de données
│   └── schema.sql               # Schéma PostgreSQL
│
├── 📄 .env.example              # Template configuration
├── 📄 .gitignore                # Fichiers à ignorer
└── 📄 README.md                 # Ce fichier
```

---

## 🎯 Cas d'Usage

### Pour Propriétaires de Gîtes
- Gérer 1 à 10+ propriétés depuis une seule interface
- Réduire les commissions (15-20% → 3% avec Stripe)
- Automatiser 80% des tâches répétitives
- Suivre la rentabilité en temps réel

### Pour Gestionnaires Immobiliers
- Gérer plusieurs clients/propriétés
- Déléguer l'accès aux femmes de ménage
- Rapports financiers automatiques
- Multi-utilisateurs avec rôles

### Pour Développeurs
- Code source complet et documenté
- Architecture modulaire
- API REST complète
- Facilement personnalisable

---

## 🌟 Captures d'Écran

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Dashboard+KPI)

### Calendrier
![Calendar](https://via.placeholder.com/800x400/10B981/FFFFFF?text=Calendrier+Unifie)

### Site Vitrine
![Booking](https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=Reservations+Directes)

---

## 🚀 Déploiement en Production

### Option 1 : Vercel + Railway (Recommandé)

**Avantages** : Gratuit, simple, rapide

1. **Frontend** → Vercel (gratuit)
2. **Backend** → Railway (gratuit 500h/mois)
3. **Database** → Supabase (gratuit 500MB)

📖 Guide complet : [PUBLIER_GITHUB.md](PUBLIER_GITHUB.md)

### Option 2 : VPS (DigitalOcean, OVH)

**Avantages** : Contrôle total, pas de limites

~5-10€/mois pour un VPS

---

## 🔧 Configuration

### Variables d'Environnement Requises

```bash
# Stripe
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx

# SendGrid
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@votredomaine.com

# Twilio
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+33xxx

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
```

📖 Voir [INSTALLATION.md](INSTALLATION.md) pour obtenir ces clés

---

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📊 Roadmap

### Version 2.1 (Q1 2025)
- [ ] Application mobile (React Native)
- [ ] Intégration Airbnb API officielle
- [ ] Multi-langue (EN, ES, DE)
- [ ] Template builder visuel

### Version 2.2 (Q2 2025)
- [ ] Intelligence artificielle (pricing dynamique)
- [ ] Chatbot voyageurs
- [ ] Analytics avancés
- [ ] API publique

---

## 📝 License

MIT License - Voir [LICENSE](LICENSE) pour plus de détails

---

## 👨‍💻 Auteur

**Votre Nom**
- GitHub : [@votre-username](https://github.com/votre-username)
- Email : votre@email.com
- LinkedIn : [Votre Profil](https://linkedin.com/in/votre-profil)

---

## 💡 Support

- 📖 [Documentation complète](INSTALLATION.md)
- 🐛 [Signaler un bug](https://github.com/votre-username/gite-master/issues)
- 💬 [Discussions](https://github.com/votre-username/gite-master/discussions)

---

## 🙏 Remerciements

- [Stripe](https://stripe.com) pour l'API de paiement
- [SendGrid](https://sendgrid.com) pour les emails
- [Supabase](https://supabase.com) pour la base de données
- [Vercel](https://vercel.com) pour l'hébergement

---

## ⭐ Star History

Si ce projet vous aide, n'oubliez pas de mettre une étoile ⭐ !

[![Star History Chart](https://api.star-history.com/svg?repos=votre-username/gite-master&type=Date)](https://star-history.com/#votre-username/gite-master&Date)

---

**Fait avec ❤️ en France 🇫🇷**
