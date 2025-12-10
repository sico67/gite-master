# 🚀 GUIDE SETUP - SUPABASE + STRIPE

## 📋 TABLE DES MATIÈRES
1. [Supabase Setup](#supabase-setup)
2. [Stripe Setup](#stripe-setup)
3. [Configuration App](#configuration-app)
4. [Tests](#tests)
5. [Troubleshooting](#troubleshooting)

---

## 🗄️ SUPABASE SETUP

### **Étape 1: Créer un projet**

1. Aller sur https://supabase.com
2. Cliquer "Start your project"
3. Se connecter (GitHub/Google/Email)
4. Cliquer "New Project"
5. Remplir:
   - **Name**: gitemaster (ou autre)
   - **Database Password**: Générer un mot de passe fort
   - **Region**: Europe West (le plus proche)
   - **Pricing Plan**: Free (500MB + 2GB bandwidth)
6. Cliquer "Create new project"
7. Attendre 2-3 minutes (création de la DB)

### **Étape 2: Créer les tables**

1. Dans le dashboard Supabase
2. Aller dans **SQL Editor** (menu gauche)
3. Cliquer "New Query"
4. Copier tout le contenu de `supabase-schema.sql`
5. Coller dans l'éditeur
6. Cliquer "Run" (ou Ctrl+Enter)
7. Vérifier: ✅ "Success. No rows returned"

### **Étape 3: Vérifier les tables**

1. Aller dans **Table Editor** (menu gauche)
2. Vérifier que ces tables existent:
   - ✅ bookings
   - ✅ properties
   - ✅ cleaning_tasks
   - ✅ payments
   - ✅ messages
   - ✅ expenses

### **Étape 4: Récupérer les clés API**

1. Aller dans **Settings** → **API** (menu gauche)
2. Noter ces 2 valeurs:
   - **Project URL**: `https://xxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **Étape 5: Créer le bucket photos (optionnel)**

1. Aller dans **Storage** (menu gauche)
2. Cliquer "Create a new bucket"
3. Remplir:
   - **Name**: property-photos
   - **Public bucket**: ✅ Coché
4. Cliquer "Create bucket"

---

## 💳 STRIPE SETUP

### **Étape 1: Créer un compte**

1. Aller sur https://stripe.com
2. Cliquer "Start now" ou "Sign up"
3. Remplir le formulaire
4. Vérifier l'email
5. Se connecter au Dashboard

### **Étape 2: Activer le mode test**

1. Dans le dashboard Stripe
2. En haut à droite: Toggle "Test mode" (⚠️ important!)
3. Vérifier: Badge "Test mode" visible

### **Étape 3: Récupérer la clé publique**

1. Aller dans **Developers** → **API keys**
2. Section "Standard keys"
3. Copier **Publishable key** (commence par `pk_test_...`)
4. ⚠️ NE PAS copier Secret key (elle reste sur votre backend)

### **Étape 4: Cartes de test**

En mode test, utilisez ces cartes:

| Carte | Numéro | CVC | Date | Résultat |
|-------|--------|-----|------|----------|
| Visa | 4242 4242 4242 4242 | 123 | 12/34 | ✅ Succès |
| Visa | 4000 0000 0000 0002 | 123 | 12/34 | ❌ Décliné |
| Visa | 4000 0027 6000 3184 | 123 | 12/34 | 🔐 3D Secure |
| Mastercard | 5555 5555 5555 4444 | 123 | 12/34 | ✅ Succès |

### **Étape 5: Webhooks (optionnel - avancé)**

1. Aller dans **Developers** → **Webhooks**
2. Cliquer "Add endpoint"
3. Entrer votre URL: `https://votre-api.com/webhook/stripe`
4. Sélectionner événements:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copier "Signing secret" (commence par `whsec_...`)

---

## ⚙️ CONFIGURATION APP

### **Étape 1: Configurer Supabase**

1. Dans Gîte Master
2. Aller dans **Admin** → **Intégrations**
3. Section "Supabase"
4. Coller:
   - **URL du projet**: Votre URL Supabase
   - **Anon Key**: Votre clé anon public
5. Cliquer "Tester la connexion"
6. Vérifier: ✅ "Connexion réussie"

### **Étape 2: Migrer les données**

1. Toujours dans Admin → Intégrations → Supabase
2. Cliquer "Migrer depuis localStorage"
3. Confirmer
4. Attendre migration
5. Vérifier: ✅ "Migration réussie ! X items migrés"

### **Étape 3: Configurer Stripe**

1. Aller dans **Admin** → **Intégrations**
2. Section "Stripe"
3. Coller:
   - **Publishable Key**: Votre clé pk_test_...
4. Cliquer "Tester la connexion"
5. Vérifier: ✅ "Connexion Stripe OK"

### **Étape 4: Voir cartes test**

1. Dans Admin → Intégrations → Stripe
2. Cliquer "Voir cartes test"
3. Noter les numéros pour vos tests

---

## 🧪 TESTS

### **Test Supabase**

#### **1. Créer une réservation**
```
Calendrier → Nouvelle réservation
Remplir formulaire → Enregistrer
```

#### **2. Vérifier dans Supabase**
```
Dashboard Supabase → Table Editor → bookings
→ Voir la nouvelle ligne
```

#### **3. Modifier la réservation**
```
Dans Gîte Master: Modifier statut
Dans Supabase: Refresh → Voir le changement
```

#### **4. Sync temps réel (avancé)**
```
Ouvrir 2 onglets Gîte Master
Créer réservation dans onglet 1
→ Devrait apparaître dans onglet 2 (après refresh)
```

### **Test Stripe**

#### **1. Simuler un paiement**
```javascript
// Dans la console navigateur (F12)
const result = await StripeService.createPaymentIntent(100, 'eur');
console.log(result);
// → Should return clientSecret
```

#### **2. Test caution**
```javascript
const deposit = await StripeService.createDeposit(500, 'eur');
console.log(deposit);
// → Should return intentId + clientSecret
```

#### **3. Vérifier dans Stripe Dashboard**
```
Dashboard Stripe → Payments
→ Voir les tentatives de paiement
```

---

## 🔧 TROUBLESHOOTING

### **Supabase : Erreur "Invalid API key"**

**Cause**: Clé incorrecte ou projet non créé

**Solution**:
1. Vérifier que le projet est bien créé (2-3 min)
2. Copier à nouveau la clé depuis Settings → API
3. Vérifier qu'il n'y a pas d'espaces avant/après
4. Recharger la page

### **Supabase : Erreur "relation does not exist"**

**Cause**: Tables pas créées

**Solution**:
1. Aller dans SQL Editor
2. Exécuter `supabase-schema.sql`
3. Vérifier dans Table Editor que les tables existent

### **Supabase : Migration échoue**

**Cause**: Données corrompues ou format incorrect

**Solution**:
1. Ouvrir console (F12)
2. Voir l'erreur exacte
3. Vérifier format localStorage:
```javascript
console.log(localStorage.getItem('gitemaster_bookings'));
```
4. Si nécessaire, nettoyer et recréer

### **Stripe : "No such API key"**

**Cause**: Clé incorrecte ou mode test/prod mélangé

**Solution**:
1. Vérifier mode TEST activé (dashboard)
2. Copier clé qui commence par `pk_test_` (pas `pk_live_`)
3. Recharger la page
4. Tester à nouveau

### **Stripe : Paiement décliné en test**

**Cause**: Carte test incorrecte

**Solution**:
1. Utiliser carte `4242 4242 4242 4242`
2. CVC: n'importe quels 3 chiffres
3. Date: n'importe quelle date future
4. Code postal: n'importe lequel

### **"CORS error" dans console**

**Cause**: Backend pas configuré ou URL incorrecte

**Solution**:
Pour développement:
1. Les appels API Stripe nécessitent un backend
2. En attendant, les paiements sont simulés
3. Voir console pour logs de simulation

---

## 📊 VÉRIFICATION FINALE

### **Checklist Supabase ✅**
- [ ] Projet créé
- [ ] Tables créées (6 tables)
- [ ] URL + anon key copiées
- [ ] Configuration app OK
- [ ] Test connexion réussi
- [ ] Migration effectuée
- [ ] Données visibles dans Table Editor

### **Checklist Stripe ✅**
- [ ] Compte créé
- [ ] Mode TEST activé
- [ ] Publishable key copiée
- [ ] Configuration app OK
- [ ] Test connexion réussi
- [ ] Cartes test notées
- [ ] Test paiement simulé OK

---

## 🎯 PROCHAINES ÉTAPES

Une fois tout configuré:

1. **Backend API (optionnel)**: Pour Stripe en production
2. **Webhooks**: Écouter événements Stripe
3. **Auth Supabase**: Connexion multi-utilisateurs
4. **Realtime**: Sync instantané entre devices
5. **Storage**: Upload photos propriétés

---

## 📚 RESSOURCES

**Supabase**:
- Docs: https://supabase.com/docs
- Guides: https://supabase.com/docs/guides
- Discord: https://discord.supabase.com

**Stripe**:
- Docs: https://stripe.com/docs
- Testing: https://stripe.com/docs/testing
- Dashboard: https://dashboard.stripe.com

---

## 💡 NOTES IMPORTANTES

### **Supabase Gratuit**
- 500 MB base de données
- 2 GB bandwidth/mois
- 50k requêtes/mois
- Largement suffisant pour démarrer

### **Stripe Test**
- Gratuit à vie
- Paiements simulés
- Toutes les features disponibles
- Passer en prod quand prêt

### **Migration localStorage → Supabase**
- Ne supprime PAS localStorage (backup)
- Fait une copie dans Supabase
- Peut être refait à tout moment
- Données dupliquées = OK

### **Mode Simulation vs Production**
- **Sans config**: Paiements simulés (console.log)
- **Avec config**: Paiements réels (mode test)
- **Production**: Clés live (pk_live_, sk_live_)

---

**Bon setup ! 🚀**

*Besoin d'aide ? Ouvrir un ticket ou consulter les docs.*
