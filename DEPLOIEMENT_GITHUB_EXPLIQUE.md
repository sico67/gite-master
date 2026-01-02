# 🚀 GUIDE COMPLET : DÉPLOYER SUR GITHUB (EXPLIQUÉ SIMPLEMENT)

## 🎯 C'EST QUOI DÉPLOYER SUR GITHUB ?

### En Termes Simples

**GitHub** = Un "Google Drive" pour développeurs
- Tu mets ton code en ligne
- Tu peux le partager
- Tu peux y accéder de n'importe où
- Historique de toutes tes modifications

**Déployer** = Envoyer ton code local → GitHub

---

## 📚 LES CONCEPTS DE BASE

### 1️⃣ Git vs GitHub

**Git** = Logiciel sur ton ordinateur
- Comme Word pour écrire
- Suit les modifications de ton code
- Fonctionne en local (sur ton PC)

**GitHub** = Site web (github.com)
- Comme OneDrive pour partager des fichiers Word
- Stocke ton code en ligne
- Permet de collaborer

### 2️⃣ Les Commandes de Base

```bash
git init          # Créer un projet Git
git add .         # Préparer les fichiers à envoyer
git commit        # Sauvegarder les modifications
git push          # Envoyer vers GitHub
```

**Analogie :**
- `git add` = Mettre des affaires dans un carton
- `git commit` = Fermer et étiqueter le carton
- `git push` = Envoyer le carton par la Poste

### 3️⃣ Repository (Repo)

**Repository** = Un projet / un dossier de code

Exemple :
```
github.com/ton-username/gite-master
```

---

## 🛠️ INSTALLATION PRÉALABLE

### Étape 1 : Installer Git

#### Sur Windows
1. Aller sur [git-scm.com](https://git-scm.com/download/win)
2. Télécharger l'installateur
3. Lancer l'installation (tout laisser par défaut)
4. Redémarrer le terminal

#### Sur Mac
```bash
# Ouvrir le Terminal
# Taper :
brew install git

# Ou si Homebrew n'est pas installé :
xcode-select --install
```

#### Sur Linux
```bash
sudo apt-get install git
```

### Étape 2 : Vérifier l'Installation

```bash
# Ouvrir un terminal
git --version

# Devrait afficher quelque chose comme :
# git version 2.40.0
```

✅ **Si tu vois une version, c'est bon !**

### Étape 3 : Configurer Git

```bash
# Ton nom (sera visible sur GitHub)
git config --global user.name "Ton Nom"

# Ton email (celui de ton compte GitHub)
git config --global user.email "ton@email.com"

# Vérifier
git config --global --list
```

---

## 🌐 CRÉER UN COMPTE GITHUB

### Étape 1 : S'inscrire

1. Aller sur [github.com](https://github.com)
2. Cliquer sur **Sign up** (Inscription)
3. Remplir :
   - Username : `ton-username` (ex: `jean-dupont`)
   - Email : `ton@email.com`
   - Password : (mot de passe fort)
4. Vérifier l'email
5. Choisir le plan **Free** (gratuit)

✅ **Ton compte GitHub est créé !**

---

## 📦 DÉPLOYER TON PROJET : MÉTHODE DÉTAILLÉE

### OPTION 1 : INTERFACE GRAPHIQUE (PLUS SIMPLE)

#### Avec GitHub Desktop (Recommandé pour débutants)

##### 1. Installer GitHub Desktop

1. Aller sur [desktop.github.com](https://desktop.github.com)
2. Télécharger pour ton OS (Windows/Mac)
3. Installer et ouvrir
4. Se connecter avec ton compte GitHub

##### 2. Ajouter ton Projet

1. Dans GitHub Desktop : **File** → **Add Local Repository**
2. Sélectionner le dossier `gite-master`
3. Si message "not a git repository" → Cliquer **Create a repository**

##### 3. Premier Commit

1. Dans la colonne de gauche, tu vois tous tes fichiers
2. En bas à gauche :
   - **Summary** : `Initial commit - Gîte Master v2.0`
   - **Description** : (optionnel)
3. Cliquer **Commit to main**

##### 4. Publier sur GitHub

1. Cliquer **Publish repository** (en haut)
2. Remplir :
   - **Name** : `gite-master`
   - **Description** : "Application de gestion de locations"
   - **Keep this code private** : Décocher si tu veux public
3. Cliquer **Publish repository**

✅ **C'EST FAIT !** Ton code est sur GitHub !

##### 5. Vérifier

1. Aller sur `github.com/ton-username/gite-master`
2. Tu dois voir tous tes fichiers !

---

### OPTION 2 : LIGNE DE COMMANDE (POUR DÉVELOPPEURS)

#### Méthode Complète Pas-à-Pas

##### 1. Ouvrir un Terminal

**Windows :**
- Touche Windows + R
- Taper `cmd` ou `powershell`
- Entrée

**Mac :**
- Cmd + Espace
- Taper "Terminal"
- Entrée

**Linux :**
- Ctrl + Alt + T

##### 2. Naviguer vers ton Projet

```bash
# Voir où tu es
pwd

# Aller dans le dossier du projet
cd /chemin/vers/gite-master

# Exemple Windows :
cd C:\Users\TonNom\Documents\gite-master

# Exemple Mac/Linux :
cd ~/Documents/gite-master

# Vérifier que tu es au bon endroit
ls
# Tu dois voir : package.json, src/, backend/, etc.
```

##### 3. Initialiser Git

```bash
# Créer un repository Git local
git init

# Vérifier
ls -la
# Tu dois voir un dossier .git (caché)
```

**Explication :**
- `git init` crée un dossier `.git` invisible
- Ce dossier contient l'historique de ton projet

##### 4. Créer .gitignore

**SUPER IMPORTANT** pour ne pas envoyer les fichiers sensibles !

```bash
# Créer le fichier
touch .gitignore

# Ou sur Windows :
echo. > .gitignore
```

Puis éditer `.gitignore` avec un éditeur de texte :

```
# Dépendances
node_modules/
backend/node_modules/

# Variables d'environnement (TRÈS IMPORTANT !)
.env
.env.local
backend/.env

# Build
dist/
build/

# Logs
*.log

# OS
.DS_Store
Thumbs.db
```

**Pourquoi ?**
- `node_modules/` = 200 MB de dépendances inutiles
- `.env` = **TES CLÉS API SECRÈTES** (ne JAMAIS les partager)

##### 5. Ajouter les Fichiers

```bash
# Ajouter TOUS les fichiers (sauf ceux dans .gitignore)
git add .

# Vérifier ce qui sera commité
git status

# Tu dois voir en VERT les fichiers ajoutés
# Tu NE dois PAS voir .env, node_modules/, etc.
```

**⚠️ CHECKPOINT IMPORTANT :**

Si tu vois `.env` ou `node_modules/` en vert :
```bash
# STOP ! Ne continue pas
# Vérifie ton .gitignore

# Enlever .env du staging
git rm --cached .env
git rm --cached backend/.env

# Enlever node_modules
git rm -r --cached node_modules/
```

##### 6. Premier Commit

```bash
# Créer le commit (= snapshot de ton code)
git commit -m "🎉 Initial commit - Gîte Master v2.0"
```

**Explication :**
- `-m` = message
- Le message décrit ce que tu as fait

**Convention de messages :**
```bash
git commit -m "✨ Ajout fonctionnalité X"    # Nouvelle feature
git commit -m "🐛 Fix bug Y"                  # Correction bug
git commit -m "📝 Mise à jour doc"            # Documentation
git commit -m "🎨 Amélioration design"        # Design
```

##### 7. Créer le Repository sur GitHub

**Option A : Via le site**

1. Aller sur [github.com/new](https://github.com/new)
2. Remplir :
   - **Repository name** : `gite-master`
   - **Description** : "Application de gestion de locations saisonnières"
   - **Public** ou **Private** (ton choix)
   - ⚠️ **NE PAS** cocher "Add a README file"
   - ⚠️ **NE PAS** cocher "Add .gitignore"
3. Cliquer **Create repository**

**Option B : Via GitHub CLI**

```bash
# Installer GitHub CLI d'abord
# Windows : winget install GitHub.cli
# Mac : brew install gh

# Se connecter
gh auth login

# Créer le repo
gh repo create gite-master --public --source=. --remote=origin
```

##### 8. Connecter Local → GitHub

```bash
# Ajouter l'URL de ton repo GitHub
git remote add origin https://github.com/TON_USERNAME/gite-master.git

# Remplace TON_USERNAME par ton vrai username !
# Exemple : https://github.com/jean-dupont/gite-master.git

# Vérifier
git remote -v
# Tu dois voir :
# origin  https://github.com/TON_USERNAME/gite-master.git (fetch)
# origin  https://github.com/TON_USERNAME/gite-master.git (push)
```

##### 9. Renommer la Branche en "main"

```bash
# GitHub utilise "main" par défaut maintenant (plus "master")
git branch -M main
```

##### 10. PUSH ! (Envoyer vers GitHub)

```bash
# Envoyer ton code vers GitHub
git push -u origin main
```

**Tu vas voir :**
```
Username for 'https://github.com': TON_USERNAME
Password for 'https://github.com': 
```

**⚠️ IMPORTANT : Le "Password" n'est PAS ton mot de passe GitHub !**

C'est un **Personal Access Token** (voir section suivante).

---

## 🔑 AUTHENTIFICATION : PERSONAL ACCESS TOKEN

### Pourquoi ?

GitHub ne supporte plus les mots de passe depuis 2021.
Il faut un **token** (une clé spéciale).

### Créer un Token

#### Étape 1 : Aller dans les Settings

1. Aller sur [github.com](https://github.com)
2. Cliquer sur ta photo (en haut à droite)
3. **Settings**
4. Dans la barre de gauche, tout en bas : **Developer settings**
5. **Personal access tokens** → **Tokens (classic)**
6. **Generate new token** → **Generate new token (classic)**

#### Étape 2 : Configurer le Token

1. **Note** : `Gite Master Deploy`
2. **Expiration** : 90 days (ou No expiration)
3. **Scopes** (cocher) :
   - ✅ `repo` (tous les sous-items)
   - ✅ `workflow` (optionnel)
4. Cliquer **Generate token**

#### Étape 3 : COPIER LE TOKEN

⚠️ **SUPER IMPORTANT** : Le token s'affiche **UNE SEULE FOIS** !

```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**COPIE-LE** et sauvegarde-le dans un endroit sûr (gestionnaire de mots de passe).

#### Étape 4 : Utiliser le Token

Quand tu fais `git push`, utilise le token comme mot de passe :

```
Username: ton-username
Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🔄 WORKFLOW QUOTIDIEN

Une fois le projet sur GitHub, voici comment tu travailles :

### 1. Modifier ton Code Localement

```bash
# Travailler normalement sur ton code
code .  # Ouvrir VS Code
# Faire des modifications
```

### 2. Voir ce qui a Changé

```bash
# Voir les fichiers modifiés
git status

# Voir les modifications ligne par ligne
git diff
```

### 3. Sauvegarder (Commit)

```bash
# Ajouter les fichiers modifiés
git add .

# Ou ajouter un fichier spécifique
git add src/components/Dashboard.tsx

# Commit
git commit -m "✨ Ajout nouveau dashboard"
```

### 4. Envoyer vers GitHub

```bash
# Push
git push
```

**C'est tout !** Tes modifications sont maintenant sur GitHub.

### 5. Vérifier sur GitHub

1. Aller sur `github.com/ton-username/gite-master`
2. Tu dois voir tes nouveaux changements !

---

## 🌿 BRANCHES (Concept Avancé)

### C'est Quoi ?

**Branche** = Version parallèle de ton code

**Analogie :**
Imagine un arbre :
- `main` = Tronc (version stable)
- `feature-paiement` = Branche (nouvelle fonctionnalité)
- Une fois la feature terminée, tu **merges** la branche dans le tronc

### Pourquoi ?

- Travailler sur une feature sans casser le code principal
- Tester des trucs
- Collaborer à plusieurs

### Commandes

```bash
# Créer une nouvelle branche
git checkout -b feature-notifications

# Voir toutes les branches
git branch

# Changer de branche
git checkout main

# Merger une branche dans main
git checkout main
git merge feature-notifications

# Supprimer une branche
git branch -d feature-notifications
```

---

## 🐛 PROBLÈMES COURANTS & SOLUTIONS

### Problème 1 : "Permission denied"

**Cause :** Token invalide ou expiré

**Solution :**
```bash
# Créer un nouveau token sur github.com
# Puis :
git push
# Entrer le nouveau token
```

### Problème 2 : "Repository not found"

**Cause :** Mauvaise URL ou repo pas créé

**Solution :**
```bash
# Vérifier l'URL
git remote -v

# Changer l'URL si besoin
git remote set-url origin https://github.com/BON_USERNAME/gite-master.git
```

### Problème 3 : "Conflict" lors d'un merge

**Cause :** Deux versions différentes du même fichier

**Solution :**
```bash
# Git marque les conflits dans les fichiers
# Ouvrir le fichier et chercher :
<<<<<<< HEAD
Code version A
=======
Code version B
>>>>>>> branch-name

# Choisir quelle version garder
# Supprimer les marqueurs <<<, ===, >>>
# Puis :
git add fichier-conflit.tsx
git commit -m "🔀 Résolution conflit"
```

### Problème 4 : J'ai commité .env par erreur !

**Solution URGENTE :**

```bash
# AVANT le push
git rm --cached .env
git commit -m "🔥 Remove .env"

# APRÈS le push (plus complexe)
# Il faut invalider TOUTES les clés API dans .env
# Et faire :
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

git push --force

# Puis CHANGER TOUTES LES CLÉS API !!!
```

### Problème 5 : "large files" error

**Cause :** Fichier > 100 MB (limite GitHub)

**Solution :**
```bash
# Utiliser Git LFS (Large File Storage)
git lfs install
git lfs track "*.psd"  # Par exemple
git add .gitattributes
```

---

## 📊 COMMANDES UTILES

### Historique

```bash
# Voir l'historique des commits
git log

# Version simplifiée
git log --oneline

# Graphique des branches
git log --graph --oneline --all
```

### Annuler des Modifications

```bash
# Annuler les modifs d'un fichier (non commité)
git checkout -- fichier.tsx

# Annuler le dernier commit (garder les modifs)
git reset --soft HEAD~1

# Annuler le dernier commit (PERDRE les modifs)
git reset --hard HEAD~1

# Revenir à un commit précis
git checkout abc1234  # remplacer par le hash du commit
```

### Nettoyer

```bash
# Supprimer les fichiers non trackés
git clean -fd

# Voir ce qui serait supprimé (sans supprimer)
git clean -fdn
```

---

## 🔒 SÉCURITÉ : CHECKLIST

### ❌ NE JAMAIS COMMITER

- [ ] `.env` files
- [ ] `node_modules/`
- [ ] Clés API (Stripe, SendGrid, etc.)
- [ ] Mots de passe
- [ ] Tokens
- [ ] Données sensibles clients

### ✅ TOUJOURS FAIRE

- [ ] Vérifier `.gitignore` AVANT le premier commit
- [ ] Double-check `git status` avant `git add .`
- [ ] Utiliser des variables d'environnement
- [ ] Ne jamais mettre de secrets dans le code

### 🚨 Si tu as Commité un Secret

**ACTION IMMÉDIATE :**

1. **Invalider la clé** (sur Stripe, SendGrid, etc.)
2. **Supprimer du Git history** (voir Problème 4 ci-dessus)
3. **Générer une nouvelle clé**
4. **Mettre dans .env** (et vérifier qu'il est dans .gitignore)

---

## 🎓 RÉCAPITULATIF : LES ÉTAPES CLÉS

### Première Fois (Setup)

1. ✅ Installer Git
2. ✅ Configurer Git (nom, email)
3. ✅ Créer compte GitHub
4. ✅ Créer .gitignore
5. ✅ `git init`
6. ✅ `git add .`
7. ✅ `git commit -m "Initial commit"`
8. ✅ Créer repo sur GitHub
9. ✅ `git remote add origin URL`
10. ✅ `git push -u origin main`

### Quotidien (Modifications)

1. ✅ Modifier le code
2. ✅ `git status` (voir les changements)
3. ✅ `git add .` (ou fichiers spécifiques)
4. ✅ `git commit -m "Description"`
5. ✅ `git push`

---

## 🚀 ALLER PLUS LOIN

### GitHub Actions (CI/CD)

Automatiser le déploiement :

```yaml
# .github/workflows/deploy.yml
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
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Collaborer

```bash
# Cloner le projet d'un autre
git clone https://github.com/autre/projet.git

# Créer une Pull Request
# 1. Fork le repo sur GitHub
# 2. Clone ton fork
# 3. Créer une branche
# 4. Faire des modifs
# 5. Push
# 6. Aller sur GitHub → "New Pull Request"
```

---

## 🎯 EXERCICE PRATIQUE

### Étape par Étape

1. **Créer un dossier test**
   ```bash
   mkdir test-git
   cd test-git
   ```

2. **Créer un fichier**
   ```bash
   echo "# Mon Projet Test" > README.md
   ```

3. **Initialiser Git**
   ```bash
   git init
   git add README.md
   git commit -m "Premier commit"
   ```

4. **Créer repo sur GitHub** (avec l'interface)

5. **Connecter et push**
   ```bash
   git remote add origin https://github.com/TON_USERNAME/test-git.git
   git branch -M main
   git push -u origin main
   ```

6. **Vérifier sur GitHub** → Ton fichier est là !

7. **Modifier localement**
   ```bash
   echo "Nouvelle ligne" >> README.md
   git add README.md
   git commit -m "Ajout ligne"
   git push
   ```

8. **Vérifier sur GitHub** → La modification apparaît !

✅ **Bravo ! Tu maîtrises Git & GitHub !**

---

## 📚 RESSOURCES

### Documentation

- [Git Book](https://git-scm.com/book/fr/v2) (EN FRANÇAIS !)
- [GitHub Docs](https://docs.github.com/fr)
- [Oh My Git!](https://ohmygit.org/) (Jeu pour apprendre Git)

### Cheat Sheet

```bash
# Configuration
git config --global user.name "Nom"
git config --global user.email "email"

# Créer un repo
git init
git clone URL

# Sauvegarder
git status
git add .
git commit -m "Message"
git push

# Branches
git branch              # Liste
git checkout -b nom     # Créer
git merge nom           # Fusionner

# Historique
git log
git diff

# Annuler
git checkout -- fichier
git reset HEAD fichier
git revert abc1234
```

---

## ✅ PRÊT À DÉPLOYER TON PROJET !

Maintenant tu sais :
- ✅ Ce qu'est Git et GitHub
- ✅ Comment installer et configurer
- ✅ Comment créer un repo
- ✅ Comment faire des commits
- ✅ Comment push vers GitHub
- ✅ Résoudre les problèmes courants
- ✅ Travailler au quotidien

**TU ES PRÊT ! 🚀**

Reviens à [GITHUB_EXPRESS.md](GITHUB_EXPRESS.md) pour déployer Gîte Master en 5 minutes !
