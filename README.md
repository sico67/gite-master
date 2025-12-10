# 🏠 Gîte Master v2.0 - Plateforme de Gestion Locations Saisonnières

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

**Votre conciergerie, optimisée & automatisée.**

Gîte Master est une plateforme complète de gestion de locations saisonnières avec automatisation IA, multi-propriétés, et pages publiques pour voyageurs et équipes.

---

## 📋 Table des Matières

- [✨ Features](#-features)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🔐 Accès](#-accès)
- [📱 Pages Publiques](#-pages-publiques)
- [🏗️ Architecture](#️-architecture)
- [⚙️ Configuration](#️-configuration)
- [🎯 Roadmap](#-roadmap)
- [💰 Business Model](#-business-model)

---

## ✨ Features

### 🎛️ **Dashboard Admin Complet**
- KPIs en temps réel (revenus, occupation, notes)
- Graphiques interactifs cliquables
- Vue d'ensemble multi-propriétés
- Tâches urgentes & réservations à venir

### 📅 **Gestion Réservations**
- Calendrier visuel intuitif
- Création/modification réservations
- Statuts (confirmée, en attente, annulée)
- Auto-création tâches ménage
- Modal détails complet

### 💰 **Comptabilité Automatique**
- Suivi revenus/dépenses
- Taxe de séjour auto-calculée (0,80€/personne/nuit)
- Dépenses par catégorie
- Export Excel (à venir)
- Facturation automatique

### 📧 **Messagerie & Automatisation**
- Templates emails/SMS prêts
- Variables dynamiques ({guest}, {property}, etc.)
- 5 scénarios automatiques :
  - Confirmation immédiate
  - Infos J-3 (codes accès, WiFi)
  - Bienvenue J-0 (SMS)
  - Rappel J-1 (checkout)
  - Demande avis J+1
- Intégration SendGrid + Twilio

### 🧹 **Ménage & Opérations**
- Auto-création tâches (2h après checkout)
- Checklist pré-remplie (6 tâches)
- Assignment équipe
- Suivi statut
- Page rapport publique pour nettoyeurs

### 🏠 **Multi-Propriétés**
- CRUD complet propriétés
- Photos, tarifs, capacité
- Codes accès, WiFi
- Duplication propriété
- Activation/désactivation

### 📱 **Livret d'Accueil Numérique**
- QR code unique par propriété
- Infos pratiques complètes
- WiFi, accès, équipements
- Activités locales
- Check-out checklist
- Page web publique

### 🔄 **Synchronisation Multi-Plateformes**
- Airbnb, Booking, Abritel (config)
- iCal import/export
- Calendrier unifié

### ⚙️ **Administration**
- Config SendGrid/Twilio
- Gestion identifiants
- Liens avis (Google, Airbnb)
- Déconnexion sécurisée

### 📚 **Guide Intégré**
- 10 sections tutoriels
- Recherche intégrée
- Exemples concrets
- Workflow recommandé

---

## 🚀 Démarrage Rapide

### Prérequis
```bash
Node.js 18+
npm ou yarn
```

### Installation

```bash
# Cloner le repo
git clone [your-repo]
cd gite-master-v2

# Installer dépendances
npm install

# Lancer en dev
npm run dev
```

### Accéder à l'app
```
http://localhost:5173
```

---

## 🔐 Accès

### 🔒 **Interface Admin** (privée)
```
URL: http://localhost:5173
Login: admin
Password: admin123
```

### 🌐 **Pages Publiques** (sans auth)

#### 📖 Livret Voyageur
```
URL: http://localhost:5173/#guest-guide
Usage: Lien envoyé aux voyageurs après réservation
Contenu: WiFi, codes accès, règlement, activités
```

#### 🧹 Rapport Ménage
```
URL: http://localhost:5173/#cleaning-report
Usage: Lien envoyé à l'équipe ménage (SMS)
Contenu: Checklist, upload photos, signalement problèmes
```

---

## 📱 Pages Publiques - Détails

### **Guest Guide (Livret Voyageur)**

**Features :**
- ✅ Design moderne responsive
- ✅ Infos essentielles (check-in/out, contact)
- ✅ Codes accès (portail, boîte à clés)
- ✅ WiFi mis en avant
- ✅ Équipements disponibles
- ✅ Mode d'emploi appareils
- ✅ Activités à proximité
- ✅ Règlement intérieur
- ✅ Check-out checklist
- ✅ Plan Google Maps intégré

**Workflow Production :**
1. Réservation confirmée → Email auto avec lien guest-guide
2. Voyageur clique → Accède à toutes les infos
3. Pas besoin PDF, tout est web

### **Cleaning Report (Rapport Ménage)**

**Features :**
- ✅ Formulaire simple mobile-first
- ✅ Checklist interactive (8 tâches)
- ✅ Progress bar temps réel
- ✅ Upload photos multiples
- ✅ Signalement problèmes
- ✅ Notes additionnelles
- ✅ Durée intervention
- ✅ Confirmation envoi
- ✅ Sauvegarde localStorage

**Workflow Production :**
1. Tâche ménage créée auto
2. SMS envoyé au nettoyeur avec lien
3. Nettoyeur remplit rapport sur mobile
4. Propriétaire reçoit notification

---

## 🏗️ Architecture

### **Stack Technique**
```
Frontend: React 18 + TypeScript
Styling: Tailwind CSS
Icons: Lucide React
Storage: localStorage (MVP) → PostgreSQL (prod)
Auth: JWT sessions
Build: Vite
```

### **Structure Projet**
```
src/
├── components/          # Composants React
│   ├── Dashboard.tsx              # Dashboard principal
│   ├── CalendarModule.tsx         # Calendrier réservations
│   ├── MessagingModule.tsx        # Templates messages
│   ├── CleaningModule.tsx         # Gestion ménage
│   ├── AccountingModule.tsx       # Comptabilité
│   ├── AutomationModule.tsx       # Scénarios auto
│   ├── WelcomeGuideModule.tsx     # Config livret
│   ├── SyncModule.tsx             # Sync plateformes
│   ├── AdminPage.tsx              # Administration
│   ├── PropertyManager.tsx        # CRUD propriétés
│   ├── LoginPage.tsx              # Page connexion
│   ├── HelpGuide.tsx              # Guide intégré
│   ├── GuestGuidePublic.tsx       # 🌐 Livret voyageur PUBLIC
│   ├── CleaningReportPublic.tsx   # 🌐 Rapport ménage PUBLIC
│   ├── BookingDetailsModal.tsx    # Modal détails résa
│   └── MonthDetailsModal.tsx      # Modal détails mois
│
├── services/            # Logique métier
│   ├── DataService.ts             # Gestion données centralisée
│   ├── AuthService.ts             # Authentification
│   ├── EmailService.ts            # Envoi emails (SendGrid)
│   ├── SMSService.ts              # Envoi SMS (Twilio)
│   └── PropertyService.ts         # Gestion propriétés
│
├── App.tsx              # Point d'entrée + routing
└── main.tsx             # Bootstrap React
```

### **Services Singleton**

#### **DataService**
```typescript
// Gestion centralisée données
getBookings()
saveBookings()
getCleaningTasks()
saveCleaningTasks()
```

#### **AuthService**
```typescript
// Authentification
loginWithCredentials(username, password)
isAuthenticated()
logout()
```

#### **EmailService**
```typescript
// Emails automatiques
sendBookingConfirmation(booking)
sendPreArrivalInfo(booking)
sendReviewRequest(booking)
```

#### **SMSService**
```typescript
// SMS automatiques
sendBookingConfirmationSMS(booking)
sendPreArrivalSMS(booking)
sendCheckoutReminderSMS(booking)
```

---

## ⚙️ Configuration

### **SendGrid (Emails)**

1. Créer compte : https://sendgrid.com
2. Générer API Key
3. Admin → API & Envois → SendGrid
4. Configurer :
   - API Key
   - Email expéditeur
   - Nom expéditeur

**Plan Gratuit :** 100 emails/jour ✅

### **Twilio (SMS)**

1. Créer compte : https://twilio.com
2. Obtenir credentials
3. Admin → API & Envois → Twilio
4. Configurer :
   - Account SID
   - Auth Token
   - Numéro Twilio

**Crédit Gratuit :** 10€ (~200 SMS) ✅

### **Mode Simulation**

Sans config, les envois sont simulés (console.log).
Parfait pour tester sans dépenser !

---

## 🎯 Roadmap

### ✅ **Version 1.0 - MVP (ACTUEL)**
- [x] Dashboard interactif
- [x] Gestion réservations
- [x] Multi-propriétés
- [x] Auto-ménage
- [x] Templates messages
- [x] Comptabilité basique
- [x] Pages publiques (guest guide + cleaning report)
- [x] Guide intégré

### 🚧 **Version 1.5 - Beta (3 mois)**
- [ ] Base de données (PostgreSQL/Supabase)
- [ ] Stripe paiements réels
- [ ] SendGrid/Twilio envois prod
- [ ] PWA mobile
- [ ] Onboarding guidé (5 min)
- [ ] 10 templates prêts

### 🚀 **Version 2.0 - Launch (6 mois)**
- [ ] Assistant IA (GPT-4) 🤖
  - Rédaction annonces
  - Suggestions prix
  - Réponses messages auto
  - Analyses performances
- [ ] Marketplace extensions
- [ ] Facturation automatique
- [ ] Export compta Excel
- [ ] Analytics avancés

### 💎 **Version 3.0 - Scale (12 mois)**
- [ ] White label
- [ ] API publique
- [ ] Multi-utilisateurs
- [ ] Moteur réservation sans commission
- [ ] Intégration serrures connectées
- [ ] App mobile native

---

## 💰 Business Model

### **Plans Tarifaires (Cibles)**

| Plan | Prix | Features | Cible |
|------|------|----------|-------|
| **Gratuit** | 0€ | 1 propriété, 5% commission | Acquisition |
| **Starter** | 19€/mois | 3 propriétés, 0% commission | Petits propriétaires |
| **Pro** | 49€/mois | 10 propriétés, IA illimité | Gestionnaires |
| **Business** | 149€/mois | 50 propriétés, White label | Agences |

### **Revenus Additionnels**
- Extensions premium : +10-30€/mois
- Commission marketplace : 30%
- Services partenaires : 20%

### **Projections**

**Scénario Bootstrap :**
- Investissement An 1 : 8,400€
- Profit An 1 : 58,735€
- ROI : 699% 🚀
- Exit 3 ans : 11-17M€

**Scénario Croissance :**
- Investissement An 1 : 99,595€
- Profit An 1 : 545,198€
- ROI : 547% 💎
- Exit 3 ans : 52-78M€

---

## 🔧 Développement

### **Variables d'environnement (à venir)**
```env
VITE_API_URL=http://localhost:3000
VITE_SENDGRID_API_KEY=your_key
VITE_TWILIO_SID=your_sid
VITE_TWILIO_TOKEN=your_token
VITE_STRIPE_PUBLIC_KEY=your_key
```

### **Build Production**
```bash
npm run build
# Output: dist/
```

### **Tests (à venir)**
```bash
npm run test
```

---

## 📊 Comparaison Concurrence

| Feature | Gîte Master | Smoobu | Lodgify | Guesty |
|---------|-------------|--------|---------|--------|
| Onboarding | ✅ 5 min | ❌ 30 min | ❌ 1h | ❌ 2h |
| Assistant IA | ✅ | ❌ | ❌ | ❌ |
| Templates prêts | ✅ | ❌ | ✅ | ❌ |
| No-code total | ✅ | ⚠️ | ⚠️ | ❌ |
| Marketplace | 🚧 | ❌ | ⚠️ | ✅ |
| Mobile app | 🚧 | ✅ | ✅ | ✅ |
| Prix | 19€ | 39€ | 16€ | 150€ |

**Notre différenciateur : IA + Simplicité + Prix** 🎯

---

## 🤝 Support

### **Documentation**
- Guide intégré : Bouton "Aide" dans l'app
- 10 sections tutoriels
- Exemples concrets

### **Contact**
- Email : support@gitemaster.com (à venir)
- Discord : communauté (à venir)

---

## 📜 License

Proprietary - Tous droits réservés © 2025 Gîte Master

---

## 🎉 Quick Start Checklist

- [x] ✅ Installer dépendances
- [x] ✅ Lancer app (localhost:5173)
- [x] ✅ Login (admin/admin123)
- [ ] 🔧 Créer première propriété (Admin → Propriétés)
- [ ] 🔧 Tester réservation (Calendrier)
- [ ] 🔧 Vérifier auto-ménage (Ménage)
- [ ] 🔧 Configurer SendGrid (optionnel)
- [ ] 🌐 Tester page publique : `/#guest-guide`
- [ ] 🌐 Tester rapport ménage : `/#cleaning-report`

---

**Bon développement ! 🚀**

*Made with ❤️ for property managers who want to save time and money.*
