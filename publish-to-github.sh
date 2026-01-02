#!/bin/bash

# ========================================
# SCRIPT DE PUBLICATION GITHUB
# Gîte Master v2.0
# ========================================

echo "🚀 Publication de Gîte Master sur GitHub"
echo "========================================"
echo ""

# Couleurs pour le terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ========================================
# ÉTAPE 1 : Vérifications préalables
# ========================================

echo -e "${BLUE}📋 Étape 1/7 : Vérifications préalables${NC}"

# Vérifier que Git est installé
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git n'est pas installé. Installez-le depuis https://git-scm.com${NC}"
    exit 1
fi

# Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur : package.json introuvable${NC}"
    echo "Assurez-vous d'être dans le dossier racine du projet (gite-master)"
    exit 1
fi

echo -e "${GREEN}✅ Git installé${NC}"
echo -e "${GREEN}✅ Dossier correct${NC}"
echo ""

# ========================================
# ÉTAPE 2 : Configuration Git
# ========================================

echo -e "${BLUE}📋 Étape 2/7 : Configuration Git${NC}"

# Demander le nom d'utilisateur GitHub
read -p "Entrez votre nom d'utilisateur GitHub : " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ Le nom d'utilisateur ne peut pas être vide${NC}"
    exit 1
fi

# Demander le nom du repository
read -p "Entrez le nom du repository (par défaut: gite-master) : " REPO_NAME
REPO_NAME=${REPO_NAME:-gite-master}

echo -e "${GREEN}✅ Username : $GITHUB_USERNAME${NC}"
echo -e "${GREEN}✅ Repository : $REPO_NAME${NC}"
echo ""

# ========================================
# ÉTAPE 3 : Initialiser Git
# ========================================

echo -e "${BLUE}📋 Étape 3/7 : Initialisation Git${NC}"

# Initialiser Git si nécessaire
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Repository Git initialisé${NC}"
else
    echo -e "${GREEN}✅ Repository Git déjà initialisé${NC}"
fi

# Configurer la branche principale
git branch -M main
echo -e "${GREEN}✅ Branche 'main' créée${NC}"
echo ""

# ========================================
# ÉTAPE 4 : Vérifier .gitignore
# ========================================

echo -e "${BLUE}📋 Étape 4/7 : Vérification .gitignore${NC}"

if [ ! -f ".gitignore" ]; then
    echo -e "${RED}⚠️  .gitignore manquant - création automatique${NC}"
    cat > .gitignore << 'EOF'
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

# Logs
*.log

# OS
.DS_Store
EOF
    echo -e "${GREEN}✅ .gitignore créé${NC}"
else
    echo -e "${GREEN}✅ .gitignore existe${NC}"
fi
echo ""

# ========================================
# ÉTAPE 5 : Ajouter les fichiers
# ========================================

echo -e "${BLUE}📋 Étape 5/7 : Ajout des fichiers${NC}"

# Vérifier qu'on n'ajoute pas de fichiers sensibles
echo "Vérification des fichiers sensibles..."

if [ -f ".env" ] || [ -f ".env.local" ] || [ -f "backend/.env" ]; then
    echo -e "${RED}⚠️  ATTENTION : Des fichiers .env ont été détectés${NC}"
    echo "Ces fichiers contiennent vos clés API et NE DOIVENT PAS être poussés sur GitHub"
    echo ""
    read -p "Voulez-vous continuer ? Les fichiers .env seront ignorés. (o/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        exit 1
    fi
fi

# Ajouter tous les fichiers
git add .

echo -e "${GREEN}✅ Fichiers ajoutés${NC}"
echo ""

# Afficher les fichiers qui vont être commités
echo "Fichiers à commiter :"
git diff --cached --name-only | head -20
echo ""

# ========================================
# ÉTAPE 6 : Premier commit
# ========================================

echo -e "${BLUE}📋 Étape 6/7 : Premier commit${NC}"

git commit -m "🎉 Initial commit - Gîte Master v2.0

✨ Fonctionnalités :
- Réservations directes avec Stripe
- Automatisation emails/SMS
- Synchronisation iCal multi-plateformes
- Comptabilité et taxe de séjour
- Site vitrine public
- Livret d'accueil numérique
- Gestion complète des opérations"

echo -e "${GREEN}✅ Commit créé${NC}"
echo ""

# ========================================
# ÉTAPE 7 : Push sur GitHub
# ========================================

echo -e "${BLUE}📋 Étape 7/7 : Push sur GitHub${NC}"
echo ""
echo "⚠️  IMPORTANT : Avant de continuer :"
echo "1. Allez sur https://github.com/new"
echo "2. Créez un nouveau repository nommé : $REPO_NAME"
echo "3. Ne cochez PAS 'Initialize with README'"
echo "4. Cliquez sur 'Create repository'"
echo ""
read -p "Avez-vous créé le repository sur GitHub ? (o/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Oo]$ ]]; then
    echo -e "${RED}❌ Création du repository annulée${NC}"
    echo "Une fois le repository créé, relancez ce script"
    exit 1
fi

# Ajouter le remote
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
git remote remove origin 2>/dev/null # Supprimer l'ancien remote s'il existe
git remote add origin "$REPO_URL"

echo -e "${GREEN}✅ Remote ajouté : $REPO_URL${NC}"
echo ""

# Push
echo "🚀 Push en cours..."
if git push -u origin main; then
    echo ""
    echo -e "${GREEN}✅✅✅ SUCCÈS ! ✅✅✅${NC}"
    echo ""
    echo "🎉 Votre projet est maintenant sur GitHub !"
    echo "🔗 URL : https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "📋 Prochaines étapes :"
    echo "1. Ouvrir le repository sur GitHub"
    echo "2. Vérifier que tous les fichiers sont là"
    echo "3. Suivre PUBLIER_GITHUB.md pour déployer sur Vercel/Railway"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Erreur lors du push${NC}"
    echo ""
    echo "Solutions possibles :"
    echo "1. Vérifiez votre connexion internet"
    echo "2. Vérifiez que le repository existe sur GitHub"
    echo "3. Authentifiez-vous avec 'gh auth login' (GitHub CLI)"
    echo "4. Ou utilisez un Personal Access Token"
    echo ""
    echo "Pour créer un token :"
    echo "- Allez sur https://github.com/settings/tokens"
    echo "- 'Generate new token (classic)'"
    echo "- Cochez 'repo'"
    echo "- Utilisez ce token comme mot de passe lors du push"
    exit 1
fi

echo ""
echo "=========================================="
echo "Script terminé !"
echo "=========================================="
