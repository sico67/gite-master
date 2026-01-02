# 🚀 GUIDE D'INSTALLATION COMPLET - GÎTE MASTER

## 📋 TABLE DES MATIÈRES

1. [Prérequis](#prérequis)
2. [Installation Frontend](#installation-frontend)
3. [Installation Backend](#installation-backend)
4. [Configuration des Services Tiers](#configuration-des-services-tiers)
5. [Configuration de la Base de Données](#configuration-de-la-base-de-données)
6. [Déploiement](#déploiement)
7. [Tests](#tests)
8. [Dépannage](#dépannage)

---

## 🔧 PRÉREQUIS

### Logiciels nécessaires

- **Node.js** version 18+ ([télécharger](https://nodejs.org/))
- **npm** ou **yarn** (inclus avec Node.js)
- **Git** ([télécharger](https://git-scm.com/))
- Un éditeur de code (VS Code recommandé)

### Comptes à créer (gratuits)

1. **Stripe** - Paiements en ligne ([créer un compte](https://stripe.com))
2. **SendGrid** - Envoi d'emails ([créer un compte](https://sendgrid.com))
3. **Twilio** - Envoi de SMS ([créer un compte](https://twilio.com))
4. **Supabase** - Base de données ([créer un compte](https://supabase.com))

---

## 💻 INSTALLATION FRONTEND

### Étape 1: Cloner le projet

```bash
git clone https://github.com/votre-username/gite-master.git
cd gite-master
```

### Étape 2: Installer les dépendances

```bash
npm install
```

### Étape 3: Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.example .env.local
```

Éditez `.env.local` et ajoutez vos clés :

```env
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_VOTRE_CLE_ICI
REACT_APP_BACKEND_URL=http://localhost:3001
```

### Étape 4: Lancer le frontend

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

---

## 🖥️ INSTALLATION BACKEND

### Étape 1: Aller dans le dossier backend

```bash
cd backend
```

### Étape 2: Installer les dépendances

```bash
npm install
```

### Étape 3: Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `backend` :

```bash
cp ../.env.example .env
```

Ajoutez TOUTES les clés API dans ce fichier.

### Étape 4: Lancer le backend

```bash
npm run dev
```

Le backend sera accessible sur `http://localhost:3001`

---

## 🔑 CONFIGURATION DES SERVICES TIERS

### 1. STRIPE (Paiements)

#### Obtenir les clés API

1. Allez sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Cliquez sur **Développeurs** > **Clés API**
3. Copiez la **Clé publiable** (commence par `pk_test_`)
4. Cliquez sur **Afficher** pour voir la **Clé secrète** (commence par `sk_test_`)

```env
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXX
```

#### Configurer le webhook

1. Allez sur **Développeurs** > **Webhooks**
2. Cliquez sur **Ajouter un endpoint**
3. URL: `https://votre-backend.com/api/stripe-webhook`
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Copiez le **Secret de signature** (commence par `whsec_`)

```env
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXX
```

#### Tester en local (utiliser Stripe CLI)

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe
# ou télécharger depuis https://stripe.com/docs/stripe-cli

# Se connecter
stripe login

# Transférer les webhooks localement
stripe listen --forward-to localhost:3001/api/stripe-webhook
```

---

### 2. SENDGRID (Emails)

#### Obtenir la clé API

1. Allez sur [app.sendgrid.com](https://app.sendgrid.com)
2. Cliquez sur **Settings** > **API Keys**
3. Cliquez sur **Create API Key**
4. Nom: "Gite Master"
5. Permissions: **Full Access** (ou au minimum **Mail Send**)
6. Copiez la clé (elle ne sera affichée qu'une fois !)

```env
SENDGRID_API_KEY=SG.XXXXXXXXXX
SENDGRID_FROM_EMAIL=noreply@votredomaine.com
SENDGRID_FROM_NAME=Gîte Master
```

#### Vérifier votre email d'expéditeur

1. Allez sur **Settings** > **Sender Authentication**
2. Cliquez sur **Verify a Single Sender**
3. Remplissez le formulaire avec l'email que vous utiliserez
4. Vérifiez votre email et cliquez sur le lien de confirmation

#### Tester l'envoi

```bash
curl -X GET "http://localhost:3001/api/test-email?email=votre@email.com"
```

---

### 3. TWILIO (SMS)

#### Obtenir les identifiants

1. Allez sur [console.twilio.com](https://console.twilio.com)
2. Sur la page d'accueil, vous verrez :
   - **Account SID** (commence par `AC`)
   - **Auth Token** (cliquez sur "Show" pour l'afficher)

```env
TWILIO_ACCOUNT_SID=ACXXXXXXXXXX
TWILIO_AUTH_TOKEN=xxxxxxxxxx
```

#### Acheter un numéro de téléphone

1. Cliquez sur **Phone Numbers** > **Buy a Number**
2. Sélectionnez votre pays (France: +33)
3. Cochez **SMS** et **Voice**
4. Achetez le numéro (environ 1€/mois)
5. Copiez le numéro au format international

```env
TWILIO_PHONE_NUMBER=+33XXXXXXXXX
```

#### Tester l'envoi SMS

```bash
curl -X GET "http://localhost:3001/api/test-sms?phone=+33612345678"
```

**Important** : En mode test Twilio, vous ne pouvez envoyer des SMS qu'aux numéros vérifiés.

---

### 4. SUPABASE (Base de Données)

#### Créer un projet

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur **Start your project**
3. Créez un nouveau projet :
   - Nom: "gite-master"
   - Mot de passe: (notez-le !)
   - Région: Frankfurt (Europe)

#### Obtenir les clés API

1. Allez dans **Settings** > **API**
2. Copiez :
   - **Project URL**
   - **anon public** (clé publique)
   - **service_role** (clé secrète - à utiliser côté backend uniquement)

```env
SUPABASE_URL=https://xxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Créer les tables

1. Allez dans **SQL Editor**
2. Copiez-collez le contenu de `database/schema.sql`
3. Cliquez sur **Run**

Ou utilisez le fichier fourni :

```bash
# Si vous avez installé Supabase CLI
supabase db push
```

---

## 🗄️ CONFIGURATION DE LA BASE DE DONNÉES

### Schéma SQL (Supabase)

Le fichier `database/schema.sql` contient toutes les tables nécessaires.

#### Tables principales :

- `properties` - Les propriétés
- `reservations` - Les réservations
- `expenses` - Les dépenses
- `messages` - Les messages
- `message_templates` - Les templates d'emails
- `channels` - Les canaux (Airbnb, Booking)

### Migration depuis mockData

Un script est fourni pour migrer les données de développement :

```bash
cd backend
npm run migrate-mockdata
```

---

## 🚀 DÉPLOIEMENT

### Frontend (Vercel - Recommandé)

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Installez Vercel CLI :

```bash
npm install -g vercel
```

3. Déployez :

```bash
vercel
```

4. Configurez les variables d'environnement dans le dashboard Vercel

### Backend (Railway - Recommandé)

1. Créez un compte sur [railway.app](https://railway.app)
2. Créez un nouveau projet
3. Connectez votre repo GitHub
4. Ajoutez les variables d'environnement
5. Déployez automatiquement

### Alternative : Netlify + Netlify Functions

Les fonctions serverless peuvent remplacer le backend Express.

---

## 🧪 TESTS

### Tester Stripe (mode test)

Utilisez ces numéros de carte :

- **Carte valide** : `4242 4242 4242 4242`
- **Paiement échoué** : `4000 0000 0000 0002`
- Date : n'importe quelle date future
- CVC : n'importe quel 3 chiffres

### Tester SendGrid

```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "votre@email.com",
    "subject": "Test Gîte Master",
    "content": "Ceci est un test !"
  }'
```

### Tester Twilio

```bash
curl -X POST http://localhost:3001/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+33612345678",
    "message": "Test SMS Gîte Master"
  }'
```

---

## 🔧 DÉPANNAGE

### Problème : "Stripe is not defined"

**Solution** : Vérifiez que la clé publique est bien dans `.env.local` et commence par `REACT_APP_`

### Problème : Emails non reçus (SendGrid)

**Solutions** :
1. Vérifiez les spam
2. Vérifiez que l'email expéditeur est vérifié
3. Consultez les logs SendGrid : Activity Feed

### Problème : SMS non reçus (Twilio)

**Solutions** :
1. En mode test, vérifiez que le numéro est dans la liste des numéros vérifiés
2. Vérifiez le solde du compte Twilio
3. Consultez les logs Twilio : Messaging Logs

### Problème : Erreur CORS

**Solution** : Ajoutez votre domaine frontend dans `cors()` du backend :

```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'https://votresite.com']
}));
```

### Problème : Base de données non accessible

**Solution** : Vérifiez que :
1. Les clés Supabase sont correctes
2. RLS (Row Level Security) est désactivé pour les tests
3. Les tables existent bien

---

## 📚 RESSOURCES

### Documentation officielle

- [Stripe Docs](https://stripe.com/docs)
- [SendGrid Docs](https://docs.sendgrid.com/)
- [Twilio Docs](https://www.twilio.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Support

- Email : support@gitemaster.com
- GitHub Issues : [github.com/votre-repo/issues](https://github.com)

---

## ✅ CHECKLIST DE MISE EN PRODUCTION

Avant de lancer en production :

- [ ] Passer Stripe en mode Live (clés `pk_live_` et `sk_live_`)
- [ ] Configurer le domaine personnalisé pour les emails SendGrid
- [ ] Activer la facturation Twilio et acheter un numéro définitif
- [ ] Configurer SSL/HTTPS sur tous les domaines
- [ ] Activer RLS (Row Level Security) sur Supabase
- [ ] Configurer les sauvegardes automatiques de la base de données
- [ ] Tester tous les flux de paiement
- [ ] Tester tous les emails automatiques
- [ ] Configurer Google Analytics (optionnel)
- [ ] Configurer Sentry pour le monitoring d'erreurs (optionnel)

---

**🎉 Félicitations ! Votre application Gîte Master est maintenant opérationnelle !**
