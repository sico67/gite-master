# ⚡ PUBLIER SUR GITHUB EN 5 MINUTES

## 🎯 Objectif
Mettre votre code sur GitHub pour pouvoir le tester et le partager.

---

## 📋 Prérequis (1 minute)

1. **Avoir un compte GitHub**
   - Pas de compte ? ➡️ [Créer un compte](https://github.com/signup) (gratuit)

2. **Git installé**
   - Vérifier : `git --version`
   - Pas installé ? ➡️ [Télécharger Git](https://git-scm.com)

---

## 🚀 Méthode Automatique (Recommandée)

### Option A : Script Automatique

```bash
# 1. Se placer dans le dossier du projet
cd gite-master

# 2. Rendre le script exécutable
chmod +x publish-to-github.sh

# 3. Exécuter le script
./publish-to-github.sh
```

Le script vous guidera étape par étape ! ✨

---

## 🔧 Méthode Manuelle (5 minutes)

### Étape 1 : Créer le repository sur GitHub (1 min)

1. Allez sur [github.com/new](https://github.com/new)
2. Remplissez :
   - **Repository name** : `gite-master`
   - **Public** ou **Private** (votre choix)
   - ⚠️ **NE PAS** cocher "Initialize with README"
3. Cliquez **Create repository**

### Étape 2 : Préparer le projet (1 min)

```bash
# Se placer dans le dossier
cd gite-master

# Vérifier que .gitignore existe
ls -la .gitignore

# S'il n'existe pas, le créer :
cat > .gitignore << EOF
node_modules/
backend/node_modules/
.env
.env.local
backend/.env
dist/
build/
*.log
.DS_Store
EOF
```

### Étape 3 : Initialiser Git (30 sec)

```bash
# Initialiser Git
git init

# Créer la branche main
git branch -M main
```

### Étape 4 : Ajouter les fichiers (30 sec)

```bash
# Ajouter tous les fichiers
git add .

# Vérifier ce qui sera commité
git status
```

⚠️ **IMPORTANT** : Vérifiez qu'il n'y a pas de fichiers `.env` dans la liste !

### Étape 5 : Premier commit (30 sec)

```bash
# Créer le commit
git commit -m "🎉 Initial commit - Gîte Master v2.0"
```

### Étape 6 : Connecter à GitHub (30 sec)

```bash
# Remplacer VOTRE_USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE_USERNAME/gite-master.git
```

### Étape 7 : Push ! (1 min)

```bash
# Envoyer le code sur GitHub
git push -u origin main
```

Si demandé :
- **Username** : Votre username GitHub
- **Password** : Votre Personal Access Token (voir ci-dessous)

---

## 🔑 Obtenir un Personal Access Token (si nécessaire)

Si GitHub vous demande un mot de passe lors du push :

1. Allez sur [github.com/settings/tokens](https://github.com/settings/tokens)
2. Cliquez **Generate new token** > **Generate new token (classic)**
3. Donnez un nom : `Gite Master`
4. Cochez : `repo` (accès complet au repository)
5. Cliquez **Generate token**
6. **COPIEZ LE TOKEN** (il ne sera affiché qu'une fois !)
7. Utilisez ce token comme "mot de passe" lors du push

---

## ✅ Vérification

1. Allez sur `https://github.com/VOTRE_USERNAME/gite-master`
2. Vous devriez voir tous vos fichiers !

---

## 🎉 C'est fait !

Votre code est maintenant sur GitHub ! 

### Prochaines étapes :

1. **Tester en local**
   ```bash
   git clone https://github.com/VOTRE_USERNAME/gite-master.git
   cd gite-master
   npm install
   npm run dev
   ```

2. **Déployer en ligne**
   - Suivez [PUBLIER_GITHUB.md](PUBLIER_GITHUB.md) pour déployer sur Vercel/Railway

3. **Partager**
   - Partagez l'URL de votre repo : `https://github.com/VOTRE_USERNAME/gite-master`

---

## 🐛 Problèmes Courants

### "Permission denied"
```bash
# Solution 1 : Utiliser un Personal Access Token (voir ci-dessus)

# Solution 2 : Utiliser SSH
# 1. Générer une clé SSH
ssh-keygen -t ed25519 -C "votre@email.com"

# 2. Ajouter la clé à GitHub
cat ~/.ssh/id_ed25519.pub
# Copier le résultat et l'ajouter sur github.com/settings/ssh/new

# 3. Changer l'URL du remote en SSH
git remote set-url origin git@github.com:VOTRE_USERNAME/gite-master.git
```

### "Repository not found"
- Vérifiez que le repository existe sur GitHub
- Vérifiez l'URL : `git remote -v`

### "Cannot push to repository"
- Vérifiez que vous êtes propriétaire du repository
- Ou que vous avez les droits d'écriture

### Fichiers .env accidentellement commités

```bash
# Supprimer du cache Git
git rm --cached .env .env.local backend/.env

# Commit
git commit -m "Remove .env files"

# Push
git push
```

---

## 📞 Aide

- 📖 [Documentation Git](https://git-scm.com/doc)
- 📖 [Documentation GitHub](https://docs.github.com)
- 💬 [Aide GitHub](https://github.com/contact)

---

## 🎯 Checklist

- [ ] Compte GitHub créé
- [ ] Git installé
- [ ] Repository créé sur GitHub
- [ ] .gitignore configuré
- [ ] Code commité
- [ ] Code pushé
- [ ] Repository visible sur GitHub

---

**Temps total : ~5 minutes** ⚡

Une fois sur GitHub, vous pourrez :
- ✅ Cloner le projet sur n'importe quelle machine
- ✅ Collaborer avec d'autres développeurs
- ✅ Déployer automatiquement (CI/CD)
- ✅ Partager votre travail

**Prêt à déployer en production ?** ➡️ [PUBLIER_GITHUB.md](PUBLIER_GITHUB.md)
