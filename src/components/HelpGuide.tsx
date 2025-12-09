import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  ChevronRight, 
  Calendar, 
  DollarSign, 
  MessageSquare,
  Sparkles,
  Users,
  ClipboardCheck,
  Home,
  Settings,
  Zap,
  FileText,
  RefreshCw,
  Search
} from 'lucide-react';

interface HelpGuideProps {
  onClose: () => void;
}

const HelpGuide: React.FC<HelpGuideProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('start');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'start',
      title: '🚀 Démarrage rapide',
      icon: Sparkles,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Bienvenue sur Gîte Master ! 👋</h3>
            <p className="text-gray-700 mb-4">
              Votre assistant intelligent pour gérer vos locations saisonnières en toute simplicité.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                <span>Configurez votre première propriété dans <strong>Admin → Propriétés</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                <span>Créez votre première réservation dans <strong>Calendrier</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                <span>Configurez les emails automatiques dans <strong>Admin → API</strong></span>
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <h4 className="font-bold text-yellow-900 mb-2">💡 Conseil pro</h4>
            <p className="text-sm text-yellow-800">
              Prenez 5 minutes pour parcourir chaque module. L'interface est intuitive et tout est cliquable !
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: '📊 Dashboard',
      icon: Home,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Vue d'ensemble de votre activité</h3>
          
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-bold text-gray-900 mb-2">✨ Tout est cliquable !</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <ChevronRight size={16} className="text-blue-600 mt-0.5" />
                <span><strong>KPI Cards</strong> : Cliquez pour voir les détails (revenus, réservations, occupation, notes)</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={16} className="text-blue-600 mt-0.5" />
                <span><strong>Graphique</strong> : Cliquez sur une barre pour voir le détail du mois</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={16} className="text-blue-600 mt-0.5" />
                <span><strong>Tâches</strong> : Cliquez pour aller dans le module Ménage</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={16} className="text-blue-600 mt-0.5" />
                <span><strong>Réservations</strong> : Cliquez sur une ligne pour aller au calendrier</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={16} className="text-blue-600 mt-0.5" />
                <span><strong>Vignettes</strong> : Accès rapide aux modules principaux</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'calendar',
      title: '📅 Calendrier',
      icon: Calendar,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Gestion des réservations</h3>
          
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">➕ Créer une réservation</h4>
              <ol className="space-y-1 text-sm text-blue-800">
                <li>1. Cliquez sur un jour vide dans le calendrier</li>
                <li>2. Le formulaire s'ouvre avec la date pré-remplie</li>
                <li>3. Remplissez : nom, email, téléphone, dates, voyageurs</li>
                <li>4. Choisissez le statut : <strong>Confirmée</strong> ou <strong>En attente</strong></li>
                <li>5. Cliquez "Créer"</li>
              </ol>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-900 mb-2">🤖 Magie automatique !</h4>
              <p className="text-sm text-green-800 mb-2">Si la réservation est <strong>confirmée</strong> :</p>
              <ul className="space-y-1 text-sm text-green-800">
                <li>✅ Tâche de ménage créée automatiquement (2h après le check-out)</li>
                <li>✅ Checklist pré-remplie (6 tâches essentielles)</li>
                <li>✅ Taxe de séjour calculée automatiquement</li>
                <li>✅ Email envoyé si SendGrid configuré</li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2">🔍 Voir les détails</h4>
              <p className="text-sm text-purple-800">
                Cliquez sur une réservation pour ouvrir la <strong>fiche complète</strong> avec :
              </p>
              <ul className="mt-2 space-y-1 text-sm text-purple-800">
                <li>• Toutes les infos client</li>
                <li>• Calcul détaillé du prix + taxe</li>
                <li>• Lien vers la tâche de ménage</li>
                <li>• Actions : Modifier, Supprimer, Contacter</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cleaning',
      title: '🧹 Ménage',
      icon: ClipboardCheck,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Gestion des tâches de ménage</h3>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-200">
            <h4 className="font-bold text-green-900 mb-2">✨ Création automatique</h4>
            <p className="text-sm text-gray-700">
              Chaque réservation <strong>confirmée</strong> génère automatiquement une tâche de ménage programmée 2h après le check-out.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-lg border p-4">
              <h4 className="font-bold text-gray-900 mb-2">📋 Checklist pré-définie</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>✓ Changer les draps</li>
                <li>✓ Aspirer et laver le sol</li>
                <li>✓ Nettoyer salle de bain</li>
                <li>✓ Nettoyer cuisine</li>
                <li>✓ Vider les poubelles</li>
                <li>✓ Vérifier stocks (PQ, savon)</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <h4 className="font-bold text-gray-900 mb-2">👤 Assigner une personne</h4>
              <p className="text-sm text-gray-700 mb-2">Pour chaque tâche, vous pouvez :</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Assigner à une personne (nom + téléphone)</li>
                <li>• Définir le coût (par défaut 80€)</li>
                <li>• Suivre le statut : En attente → Assignée → En cours → Terminée</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'automation',
      title: '⚡ Automatisations',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Messages automatiques</h3>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
            <h4 className="font-bold text-purple-900 mb-2">🤖 5 scénarios pré-configurés</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-700">1.</span>
                <span><strong>Confirmation</strong> : Envoyé immédiatement (Email)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-700">2.</span>
                <span><strong>Infos J-3</strong> : Code portail, WiFi, accès (Email)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-700">3.</span>
                <span><strong>Bienvenue J-0</strong> : Message d'arrivée (SMS)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-700">4.</span>
                <span><strong>Rappel J-1</strong> : Check-out demain (SMS)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-700">5.</span>
                <span><strong>Avis J+1</strong> : Demande d'avis avec liens (Email)</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">⚙️ Configuration requise</h4>
            <p className="text-sm text-blue-800 mb-3">
              Pour que les emails/SMS soient envoyés réellement :
            </p>
            <ol className="space-y-2 text-sm text-blue-800">
              <li><strong>1. Admin → API & Envois</strong></li>
              <li><strong>2. SendGrid</strong> (gratuit, 100 emails/jour)
                <ul className="ml-4 mt-1 space-y-1 text-xs">
                  <li>• Créer compte sur sendgrid.com</li>
                  <li>• Copier API Key</li>
                  <li>• Configurer email expéditeur</li>
                </ul>
              </li>
              <li><strong>3. Twilio</strong> (optionnel, SMS)
                <ul className="ml-4 mt-1 space-y-1 text-xs">
                  <li>• 10€ crédit offert</li>
                  <li>• ~0,05€ par SMS ensuite</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-bold text-yellow-900 mb-2">💡 Mode simulation</h4>
            <p className="text-sm text-yellow-800">
              Sans configuration, les messages sont simulés (affichés dans la console). Parfait pour tester !
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'accounting',
      title: '💰 Comptabilité',
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Revenus, dépenses & taxe</h3>
          
          <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-900 mb-2">📊 KPI Cards cliquables</h4>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• <strong>Revenus totaux</strong> : Cliquez pour voir la liste détaillée</li>
                <li>• <strong>Dépenses</strong> : Cliquez pour voir toutes les dépenses</li>
                <li>• <strong>Bénéfice net</strong> : Cliquez pour voir le calcul + marge</li>
                <li>• <strong>Taxe séjour</strong> : Cliquez pour voir par client</li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2">🏛️ Taxe de séjour automatique</h4>
              <p className="text-sm text-purple-800 mb-2">
                Calculée automatiquement pour chaque réservation :
              </p>
              <div className="bg-white rounded p-3 text-sm">
                <p className="font-mono text-purple-900">
                  <strong>Formule :</strong> Adultes × Nuits × 0,80€
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Exemple : 2 adultes × 7 nuits = 11,20€
                </p>
              </div>
              <p className="text-xs text-purple-700 mt-3">
                📅 À déclarer mensuellement avant le 15 du mois suivant
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">📈 Dépenses par catégorie</h4>
              <p className="text-sm text-blue-800 mb-2">
                Cliquez sur une catégorie pour voir le détail des transactions.
              </p>
              <p className="text-xs text-blue-700">
                Catégories : Ménage, Maintenance, Fournitures, etc.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'messaging',
      title: '💬 Messagerie',
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Templates de messages</h3>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">✍️ 5 templates prêts</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li><strong>1. Bienvenue</strong> : Message de confirmation</li>
              <li><strong>2. Infos pratiques</strong> : Accès, WiFi, parking</li>
              <li><strong>3. Check-in</strong> : Instructions d'arrivée</li>
              <li><strong>4. Check-out</strong> : Rappel départ</li>
              <li><strong>5. Avis</strong> : Demande de review avec liens</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-bold text-purple-900 mb-2">🔧 Variables dynamiques</h4>
            <p className="text-sm text-purple-800 mb-2">Insérez automatiquement :</p>
            <div className="bg-white rounded p-3 text-xs font-mono space-y-1">
              <div><span className="text-purple-600">{'{guest}'}</span> → Nom du client</div>
              <div><span className="text-purple-600">{'{property}'}</span> → Nom de la propriété</div>
              <div><span className="text-purple-600">{'{checkin}'}</span> → Date d'arrivée</div>
              <div><span className="text-purple-600">{'{checkout}'}</span> → Date de départ</div>
              <div><span className="text-purple-600">{'{code}'}</span> → Code portail</div>
              <div><span className="text-purple-600">{'{wifi}'}</span> → Mot de passe WiFi</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'guide',
      title: '📱 Livret d\'accueil',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Guide numérique pour vos clients</h3>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">📲 QR Code personnalisé</h4>
            <p className="text-sm text-gray-700 mb-3">
              Générez un QR code unique par propriété. Vos clients le scannent et accèdent instantanément au guide complet.
            </p>
            <div className="bg-white rounded p-3 text-xs">
              <p className="font-bold text-gray-900 mb-2">Le guide contient :</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Infos WiFi</li>
                <li>✓ Équipements disponibles</li>
                <li>✓ Règles de la maison</li>
                <li>✓ Contacts urgence</li>
                <li>✓ Recommandations locales</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-bold text-green-900 mb-2">🖨️ Impression</h4>
            <p className="text-sm text-green-800">
              Imprimez le QR code et placez-le dans votre logement. Plus besoin de livret papier !
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'sync',
      title: '🔄 Synchronisation',
      icon: RefreshCw,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Sync avec les plateformes</h3>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">🔗 4 plateformes supportées</h4>
            <div className="space-y-3 mt-3">
              <div className="bg-white rounded p-3">
                <p className="font-bold text-gray-900 text-sm mb-1">📅 Airbnb</p>
                <p className="text-xs text-gray-600">Import automatique des réservations</p>
              </div>
              <div className="bg-white rounded p-3">
                <p className="font-bold text-gray-900 text-sm mb-1">🌐 Booking.com</p>
                <p className="text-xs text-gray-600">Synchronisation bidirectionnelle</p>
              </div>
              <div className="bg-white rounded p-3">
                <p className="font-bold text-gray-900 text-sm mb-1">🏠 Abritel</p>
                <p className="text-xs text-gray-600">Mise à jour du calendrier</p>
              </div>
              <div className="bg-white rounded p-3">
                <p className="font-bold text-gray-900 text-sm mb-1">📆 iCal</p>
                <p className="text-xs text-gray-600">Export/Import calendrier</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-bold text-yellow-900 mb-2">⚙️ Configuration</h4>
            <p className="text-sm text-yellow-800">
              Pour chaque plateforme, configurez vos clés API dans les paramètres de synchronisation.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'admin',
      title: '⚙️ Administration',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Configuration complète</h3>
          
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">🏠 Propriétés</h4>
              <p className="text-sm text-blue-800 mb-2">Gérez toutes vos propriétés :</p>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Ajouter/Modifier/Supprimer</li>
                <li>• Dupliquer une propriété</li>
                <li>• Activer/Désactiver</li>
                <li>• Photos, tarifs, capacité</li>
                <li>• Codes d'accès, WiFi</li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2">📧 API & Envois</h4>
              <p className="text-sm text-purple-800 mb-2">Configurez les intégrations :</p>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>
                  <strong>SendGrid</strong> (Emails)
                  <ul className="ml-4 mt-1 space-y-1 text-xs">
                    <li>→ API Key</li>
                    <li>→ Email expéditeur</li>
                    <li>→ Nom expéditeur</li>
                  </ul>
                </li>
                <li>
                  <strong>Twilio</strong> (SMS)
                  <ul className="ml-4 mt-1 space-y-1 text-xs">
                    <li>→ Account SID</li>
                    <li>→ Auth Token</li>
                    <li>→ Numéro Twilio</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-900 mb-2">⭐ Liens Avis</h4>
              <p className="text-sm text-green-800 mb-2">
                Configurez les liens vers vos pages d'avis :
              </p>
              <ul className="space-y-1 text-xs text-green-800">
                <li>• Google Reviews</li>
                <li>• Airbnb</li>
                <li>• Booking.com</li>
              </ul>
              <p className="text-xs text-green-700 mt-2">
                Ces liens seront envoyés automatiquement dans l'email J+1
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-bold text-red-900 mb-2">🔒 Sécurité</h4>
              <p className="text-sm text-red-800">
                Modifiez vos identifiants de connexion pour sécuriser l'accès à l'application.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tips',
      title: '💡 Astuces & conseils',
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Optimisez votre utilisation</h3>
          
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-200">
              <h4 className="font-bold text-yellow-900 mb-3">🎯 Workflow recommandé</h4>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-yellow-600">1.</span>
                  <span>Créez vos propriétés dans Admin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-yellow-600">2.</span>
                  <span>Configurez SendGrid pour les emails automatiques</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-yellow-600">3.</span>
                  <span>Créez vos réservations (calendrier ou import plateformes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-yellow-600">4.</span>
                  <span>Vérifiez les tâches ménage auto-créées</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-yellow-600">5.</span>
                  <span>Consultez le dashboard chaque matin</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">⚡ Raccourcis clavier</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p><kbd className="px-2 py-1 bg-white rounded border text-xs">Échap</kbd> : Fermer les modals</p>
                <p><kbd className="px-2 py-1 bg-white rounded border text-xs">Tab</kbd> : Navigation dans les formulaires</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-900 mb-2">📊 Statistiques temps réel</h4>
              <p className="text-sm text-green-800 mb-2">
                Toutes les données sont calculées en temps réel. Dès qu'une réservation est créée :
              </p>
              <ul className="space-y-1 text-xs text-green-800">
                <li>✓ Dashboard mis à jour</li>
                <li>✓ Graphique actualisé</li>
                <li>✓ Comptabilité recalculée</li>
                <li>✓ Taxe séjour ajoutée</li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2">🎨 Personnalisation</h4>
              <p className="text-sm text-purple-800">
                Personnalisez les templates de messages avec vos propres textes et votre ton de communication.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.id.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Guide d'utilisation</h2>
              <p className="text-blue-100 text-sm">Tout ce que vous devez savoir</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans le guide..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-64 border-r overflow-y-auto bg-gray-50">
            <nav className="p-4 space-y-1">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-8">
            {filteredSections.find(s => s.id === activeSection)?.content}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            💡 Besoin d'aide ? Toutes les sections sont cliquables !
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpGuide;
