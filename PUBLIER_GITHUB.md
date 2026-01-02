# 🚀 PUBLIER SUR GITHUB ET TESTER

## 📋 ÉTAPES COMPLÈTES

### 1️⃣ PRÉPARER LE PROJET (5 min)

#### A. Créer les fichiers essentiels

Créez un fichier `.gitignore` à la racine :

```bash
# Dépendances
node_modules/
backend/node_modules/

# Variables d'environnement
.env
.env.local
backend/.env

# Build
dist/
build/
.vite/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temporary
.tmp/
temp/
```

#### B. Créer un README.md principal

```markdown
# 🏠 Gîte Master - Gestion de Locations Saisonnières

Application complète pour gérer vos locations Airbnb, Booking et réservations directes.

## ✨ Fonctionnalités

- 💳 Réservations directes avec paiement Stripe
- 📧 Emails et SMS automatiques
- 📅 Synchronisation calendriers (Airbnb, Booking)
- 💰 Comptabilité et taxe de séjour automatique
- 🧹 Gestion du ménage
- 📱 Livret d'accueil numérique pour voyageurs

## 🚀 Démarrage Rapide

Voir [DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)

## 📖 Documentation

- [Guide d'installation complet](INSTALLATION.md)
- [Nouveautés version 2.0](README_NOUVEAUTES.md)
- [Architecture détaillée](analyse_modules_manquants.md)

## 🛠️ Technologies

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Base de données**: PostgreSQL (Supabase)
- **Paiements**: Stripe
- **Communication**: SendGrid + Twilio

## 📦 Installation

\`\`\`bash
# Cloner le repo
git clone https://github.com/VOTRE_USERNAME/gite-master.git
cd gite-master

# Installer les dépendances
npm install
cd backend && npm install && cd ..

# Configurer
cp .env.example .env.local
cp .env.example backend/.env

# Lancer en dev
npm run dev
\`\`\`

## 📝 License

MIT

## 👨‍💻 Auteur

Votre Nom
```

---

### 2️⃣ CRÉER LE REPO GITHUB (3 min)

#### Option A : Via l'interface GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur le **+** en haut à droite > **New repository**
3. Remplissez :
   - **Repository name** : `gite-master`
   - **Description** : "Application de gestion de locations saisonnières"
   - **Visibility** : Public ou Private (selon votre choix)
   - ⚠️ **NE PAS** cocher "Initialize with README" (on a déjà nos fichiers)
4. Cliquez sur **Create repository**

#### Option B : Via GitHub CLI

```bash
# Installer GitHub CLI si pas déjà fait
# Mac: brew install gh
# Windows: winget install GitHub.cli

# Se connecter
gh auth login

# Créer le repo
gh repo create gite-master --public --source=. --remote=origin
```

---

### 3️⃣ POUSSER LE CODE SUR GITHUB (2 min)

```bash
# Se placer dans le dossier du projet
cd gite-master

# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🎉 Initial commit - Gîte Master v2.0 complet"

# Lier au repo GitHub (remplacer VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/gite-master.git

# Pousser le code
git branch -M main
git push -u origin main
```

✅ **Votre code est maintenant sur GitHub !**

---

### 4️⃣ TESTER EN LOCAL DEPUIS GITHUB (5 min)

Sur une autre machine (ou dossier) :

```bash
# Cloner le repo
git clone https://github.com/VOTRE_USERNAME/gite-master.git
cd gite-master

# Installer les dépendances
npm install
cd backend
npm install
cd ..

# Créer les fichiers de config
cp .env.example .env.local
cp .env.example backend/.env

# Éditer les .env avec vos clés (ou laisser en mode simulation)
# nano .env.local
# nano backend/.env

# Lancer l'application
npm run dev

# Dans un autre terminal
cd backend
npm run dev
```

➡️ Ouvrir [http://localhost:3000](http://localhost:3000)

---

### 5️⃣ DÉPLOYER SUR VERCEL (GRATUIT) (10 min)

Vercel permet d'héberger le frontend gratuitement avec HTTPS automatique.

#### A. Frontend sur Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Questions à répondre :
# - Set up and deploy? Y
# - Which scope? (votre compte)
# - Link to existing project? N
# - Project name? gite-master
# - Directory? ./
# - Override settings? N
```

✅ Vercel vous donnera une URL : `https://gite-master.vercel.app`

#### B. Configurer les variables d'environnement

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet `gite-master`
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez :
   - `REACT_APP_STRIPE_PUBLIC_KEY` : Votre clé Stripe publique
   - `REACT_APP_BACKEND_URL` : URL de votre backend (voir étape suivante)

---

### 6️⃣ DÉPLOYER LE BACKEND SUR RAILWAY (GRATUIT) (10 min)

Railway offre un hébergement gratuit pour les backends Node.js.

#### A. Créer un compte

1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur **Start a New Project**
3. Connectez votre compte GitHub

#### B. Déployer

1. Cliquez sur **Deploy from GitHub repo**
2. Sélectionnez `gite-master`
3. Railway détecte automatiquement Node.js

#### C. Configurer les variables d'environnement

1. Dans le dashboard Railway, cliquez sur votre service
2. Allez dans **Variables**
3. Ajoutez toutes les variables de `backend/.env` :
   ```
   NODE_ENV=production
   PORT=3001
   STRIPE_SECRET_KEY=sk_live_xxx
   SENDGRID_API_KEY=SG.xxx
   TWILIO_ACCOUNT_SID=ACxxx
   TWILIO_AUTH_TOKEN=xxx
   TWILIO_PHONE_NUMBER=+33xxx
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_ANON_KEY=xxx
   FRONTEND_URL=https://gite-master.vercel.app
   ```

4. Railway vous donnera une URL : `https://gite-master-production.up.railway.app`

#### D. Mettre à jour le frontend

Retournez sur Vercel et ajoutez/modifiez :
- `REACT_APP_BACKEND_URL` : `https://gite-master-production.up.railway.app`

Puis redéployez :
```bash
vercel --prod
```

✅ **Votre application est maintenant en ligne !**

---

### 7️⃣ CONFIGURER LA BASE DE DONNÉES SUPABASE (15 min)

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet :
   - Nom : `gite-master`
   - Database Password : (notez-le !)
   - Region : Europe (Frankfurt)

3. Une fois créé, allez dans **SQL Editor**

4. Copiez-collez le contenu de `database/schema.sql` et exécutez

5. Allez dans **Settings** > **API** et copiez :
   - Project URL
   - anon public key
   - service_role key (à garder secret)

6. Ajoutez ces clés dans Railway (variables d'environnement du backend)

---

### 8️⃣ TESTER L'APPLICATION EN LIGNE

#### A. Tester le site vitrine public

1. Allez sur `https://gite-master.vercel.app/#booking`
2. Parcourez les propriétés
3. Faites une réservation test
4. Utilisez la carte de test Stripe : `4242 4242 4242 4242`

#### B. Tester l'espace admin

1. Allez sur `https://gite-master.vercel.app`
2. Connectez-vous :
   - Email : `owner@gitemaster.com`
   - Password : `password123`
3. Testez tous les modules

#### C. Tester les emails/SMS

```bash
# Test email
curl -X POST https://gite-master-production.up.railway.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "votre@email.com",
    "subject": "Test Gîte Master",
    "content": "Ça marche !"
  }'

# Test SMS
curl -X POST https://gite-master-production.up.railway.app/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+33612345678",
    "message": "Test SMS Gîte Master"
  }'
```

---

### 9️⃣ PARTAGER VOTRE PROJET

#### A. Rendre le repo public (optionnel)

Si vous voulez que d'autres développeurs voient votre code :

1. Allez sur GitHub > Votre repo
2. **Settings** > **Danger Zone**
3. **Change repository visibility** > **Make public**

#### B. Ajouter un badge dans le README

Ajoutez en haut de votre `README.md` :

```markdown
![Deploy Status](https://img.shields.io/badge/deploy-live-success)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

🔗 **Démo live** : [https://gite-master.vercel.app](https://gite-master.vercel.app)
```

#### C. Créer un fichier CONTRIBUTING.md

Si vous voulez accepter des contributions :

```markdown
# 🤝 Contribuer à Gîte Master

Merci de votre intérêt !

## Comment contribuer

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Code de conduite

Soyez respectueux et constructif.
```

---

### 🔟 MONITORING ET MAINTENANCE

#### A. Activer les GitHub Actions (CI/CD)

Créez `.github/workflows/deploy.yml` :

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

#### B. Configurer Sentry (monitoring d'erreurs - optionnel)

```bash
npm install @sentry/react

# Ajouter dans src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "VOTRE_DSN_SENTRY",
  environment: "production",
});
```

---

## 📊 RÉCAPITULATIF

| Étape | Service | Coût | Temps |
|-------|---------|------|-------|
| 1. Préparer le projet | - | Gratuit | 5 min |
| 2. Créer repo GitHub | GitHub | Gratuit | 3 min |
| 3. Pousser le code | GitHub | Gratuit | 2 min |
| 4. Tester en local | - | Gratuit | 5 min |
| 5. Déployer frontend | Vercel | Gratuit | 10 min |
| 6. Déployer backend | Railway | Gratuit* | 10 min |
| 7. Config base de données | Supabase | Gratuit | 15 min |
| 8. Tester en ligne | - | Gratuit | 10 min |
| **TOTAL** | - | **0€** | **~1h** |

*Railway gratuit : 500h/mois (largement suffisant pour un projet perso)

---

## ✅ CHECKLIST FINALE

### Avant de déployer

- [ ] Code sur GitHub
- [ ] `.gitignore` configuré
- [ ] README.md à jour
- [ ] Variables d'environnement définies

### Déploiement

- [ ] Frontend sur Vercel
- [ ] Backend sur Railway
- [ ] Base de données sur Supabase
- [ ] Variables d'environnement configurées

### Tests

- [ ] Site vitrine accessible
- [ ] Login admin fonctionne
- [ ] Paiement Stripe fonctionne
- [ ] Emails envoyés (SendGrid)
- [ ] SMS envoyés (Twilio)

### Maintenance

- [ ] GitHub Actions configuré (optionnel)
- [ ] Monitoring actif (Sentry - optionnel)
- [ ] Sauvegardes DB planifiées

---

## 🆘 PROBLÈMES COURANTS

### "Cannot find module"
```bash
# Supprimer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### "Port already in use"
```bash
# Tuer le processus sur le port 3000
lsof -ti:3000 | xargs kill -9

# Tuer le processus sur le port 3001
lsof -ti:3001 | xargs kill -9
```

### "CORS error"
Vérifiez que l'URL du backend est correcte dans `.env.local` et que le backend autorise votre domaine frontend.

### "Stripe webhook not working"
En production, configurez le webhook sur [dashboard.stripe.com](https://dashboard.stripe.com) pour pointer vers :
`https://votre-backend.railway.app/api/stripe-webhook`

---

## 🎉 FÉLICITATIONS !

Votre application est maintenant :
- ✅ Sur GitHub
- ✅ Déployée en production
- ✅ Accessible publiquement
- ✅ Avec base de données réelle
- ✅ Avec paiements Stripe réels

**URL de démo** : `https://gite-master.vercel.app`

---

## 📞 RESSOURCES

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Railway](https://docs.railway.app/)
- [Documentation Supabase](https://supabase.com/docs)
- [Guide Git](https://git-scm.com/book/fr/v2)

**Besoin d'aide ?** Créez une issue sur GitHub !
