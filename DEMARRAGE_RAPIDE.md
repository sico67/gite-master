# ⚡ DÉMARRAGE RAPIDE - 10 MINUTES

Vous voulez tester l'application **tout de suite** ? Suivez ce guide express !

---

## 🎯 OBJECTIF

Lancer l'application en **mode développement** avec toutes les fonctionnalités, en 10 minutes chrono.

---

## ⏱️ ÉTAPE 1: INSTALLER LES DÉPENDANCES (2 min)

```bash
# Cloner le projet (si ce n'est pas déjà fait)
git clone <votre-repo>
cd gite-master

# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

---

## ⚙️ ÉTAPE 2: CONFIGURER L'ENVIRONNEMENT (3 min)

### Frontend (.env.local)

Créez le fichier `.env.local` à la racine :

```bash
# Mode DEV - Tout fonctionne en simulation
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_SIMULATION
REACT_APP_BACKEND_URL=http://localhost:3001
```

### Backend (.env)

Créez le fichier `backend/.env` :

```bash
# Mode DEV - Tout fonctionne en simulation
NODE_ENV=development
PORT=3001

# Ces clés peuvent rester vides en mode dev
STRIPE_SECRET_KEY=sk_test_SIMULATION
SENDGRID_API_KEY=SG.SIMULATION
TWILIO_ACCOUNT_SID=AC_SIMULATION
TWILIO_AUTH_TOKEN=SIMULATION
```

---

## 🚀 ÉTAPE 3: LANCER L'APPLICATION (1 min)

### Terminal 1 : Backend

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
🚀 Backend API démarré sur le port 3001
```

### Terminal 2 : Frontend

```bash
npm run dev
```

Vous devriez voir :
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
```

---

## ✅ ÉTAPE 4: TESTER (4 min)

### 1. Connexion (30 sec)

Ouvrez [http://localhost:3000](http://localhost:3000)

**Login propriétaire :**
- Email : `owner@gitemaster.com`
- Password : `password123`

**Login femme de ménage :**
- Email : `cleaner@gitemaster.com`
- Password : `password123`

### 2. Dashboard (30 sec)

Explorez le dashboard :
- ✅ KPI en temps réel
- ✅ Graphiques
- ✅ Résumé des réservations

### 3. Calendrier (1 min)

Cliquez sur **Calendrier** :
- ✅ Vue mensuelle avec réservations
- ✅ Glisser-déposer pour bloquer des dates
- ✅ Synchronisation iCal

### 4. Messagerie (1 min)

Cliquez sur **Messages** :
- ✅ Boîte de réception unifiée
- ✅ Automatisations programmées
- ✅ Templates avec variables

### 5. Site Vitrine (1 min)

Allez sur [http://localhost:3000/#booking](http://localhost:3000/#booking)

- ✅ Catalogue des propriétés
- ✅ Système de réservation
- ✅ Paiement Stripe (simulation)

**Test de réservation :**
1. Cliquez sur une propriété
2. Sélectionnez des dates
3. Remplissez vos infos
4. Cliquez sur "Payer et Réserver"
5. ➡️ La réservation est créée (mode simulation)

### 6. Taxe de Séjour (30 sec)

Cliquez sur **Finance** puis **Taxe de Séjour** :
- ✅ Calcul automatique
- ✅ Rapports mensuels
- ✅ Téléchargement de déclarations

---

## 🎯 MODE SIMULATION vs MODE PRODUCTION

### En Mode DEV (Maintenant)

✅ **Ce qui fonctionne :**
- Toutes les interfaces
- Toutes les fonctionnalités
- Données de test

⚠️ **Ce qui est simulé :**
- Paiements Stripe (pas de vraie carte)
- Emails (affichés dans les logs)
- SMS (affichés dans les logs)

### Pour Passer en Production

Suivez le guide `INSTALLATION.md` pour :
1. Créer les comptes Stripe, SendGrid, Twilio
2. Récupérer les vraies clés API
3. Configurer Supabase pour la DB
4. Déployer sur Vercel/Railway

**Temps estimé : 1 heure**

---

## 🐛 DÉPANNAGE EXPRESS

### Le frontend ne démarre pas

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Le backend ne démarre pas

```bash
# Vérifier que le port 3001 est libre
lsof -ti:3001 | xargs kill -9

# Réinstaller
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreur "CORS"

Vérifiez que le backend tourne sur le port 3001 et que le frontend est configuré pour pointer dessus dans `.env.local`

### Les réservations ne s'affichent pas

C'est normal ! En mode dev, on utilise des données mockées qui sont dans `src/services/mockData.ts`. Pour la production, il faut configurer Supabase.

---

## 📚 PROCHAINES ÉTAPES

### Maintenant que ça tourne

1. **Explorez l'application** (10 min)
   - Testez tous les modules
   - Créez des réservations de test
   - Ajoutez des dépenses

2. **Personnalisez** (30 min)
   - Modifiez les données de test dans `mockData.ts`
   - Changez les couleurs dans `tailwind.config.js`
   - Ajoutez vos propres photos

3. **Configurez pour la production** (1h)
   - Lisez `INSTALLATION.md`
   - Créez les comptes API
   - Configurez Supabase

### Ressources

- 📖 **Guide complet** : `INSTALLATION.md`
- 📋 **Analyse détaillée** : `analyse_modules_manquants.md`
- 🆕 **Nouveautés** : `README_NOUVEAUTES.md`
- 💾 **Base de données** : `database/schema.sql`

---

## 🎉 FÉLICITATIONS !

Vous avez maintenant une application de gestion de locations saisonnières **100% fonctionnelle** qui tourne en local !

**Prêt à passer en production ?** 
➡️ Consultez `INSTALLATION.md` pour les clés API réelles

**Questions ?**
➡️ Lisez `analyse_modules_manquants.md` pour comprendre l'architecture

**Besoin d'aide ?**
➡️ Consultez la section Dépannage de `INSTALLATION.md`

---

## 📊 RÉCAP 10 MIN

| Étape | Temps | Status |
|-------|-------|--------|
| 1. Installer dépendances | 2 min | ✅ |
| 2. Configurer .env | 3 min | ✅ |
| 3. Lancer l'app | 1 min | ✅ |
| 4. Tester | 4 min | ✅ |
| **TOTAL** | **10 min** | **🎉 DONE !** |

---

**Bon développement ! 🚀**
