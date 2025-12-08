import React, { useState } from 'react';
import { 
  RefreshCw, 
  Check, 
  X,
  AlertCircle,
  Calendar,
  Home,
  Link as LinkIcon,
  Settings,
  Download,
  Upload,
  Zap
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  lastSync?: string;
  propertiesLinked: number;
  pendingReservations: number;
}

interface SyncLog {
  id: string;
  platform: string;
  timestamp: string;
  action: string;
  status: 'success' | 'error' | 'warning';
  details: string;
}

const SyncModule: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'airbnb',
      name: 'Airbnb',
      logo: '🏠',
      connected: true,
      lastSync: '2025-12-08T10:30:00',
      propertiesLinked: 1,
      pendingReservations: 2
    },
    {
      id: 'booking',
      name: 'Booking.com',
      logo: '🏨',
      connected: true,
      lastSync: '2025-12-08T09:15:00',
      propertiesLinked: 1,
      pendingReservations: 1
    },
    {
      id: 'vrbo',
      name: 'VRBO',
      logo: '🏡',
      connected: false,
      propertiesLinked: 0,
      pendingReservations: 0
    },
    {
      id: 'abritel',
      name: 'Abritel',
      logo: '🏘️',
      connected: false,
      propertiesLinked: 0,
      pendingReservations: 0
    }
  ]);

  const [syncLogs] = useState<SyncLog[]>([
    {
      id: '1',
      platform: 'Airbnb',
      timestamp: '2025-12-08T10:30:00',
      action: 'Import réservations',
      status: 'success',
      details: '2 nouvelles réservations importées'
    },
    {
      id: '2',
      platform: 'Booking.com',
      timestamp: '2025-12-08T09:15:00',
      action: 'Synchronisation calendrier',
      status: 'success',
      details: 'Disponibilités mises à jour'
    },
    {
      id: '3',
      platform: 'Airbnb',
      timestamp: '2025-12-07T18:20:00',
      action: 'Export tarifs',
      status: 'warning',
      details: 'Tarif week-end non synchronisé'
    },
    {
      id: '4',
      platform: 'Booking.com',
      timestamp: '2025-12-07T15:10:00',
      action: 'Import message',
      status: 'success',
      details: '1 nouveau message client'
    }
  ]);

  const handleSyncAll = async () => {
    setSyncing(true);
    
    // Simulation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPlatforms(platforms.map(p => {
      if (p.connected) {
        return {
          ...p,
          lastSync: new Date().toISOString(),
          pendingReservations: 0
        };
      }
      return p;
    }));
    
    setSyncing(false);
  };

  const handleConnect = (platformId: string) => {
    alert(`Connexion à ${platformId} (Fonction de démonstration)
    
Dans la version complète, vous serez redirigé vers la page d'authentification de la plateforme pour autoriser l'accès à vos données.`);
  };

  const handleDisconnect = (platformId: string) => {
    if (confirm('Êtes-vous sûr de vouloir déconnecter cette plateforme ?')) {
      setPlatforms(platforms.map(p => 
        p.id === platformId ? { ...p, connected: false, lastSync: undefined } : p
      ));
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <Check size={16} />;
      case 'error': return <X size={16} />;
      case 'warning': return <AlertCircle size={16} />;
      default: return null;
    }
  };

  const connectedCount = platforms.filter(p => p.connected).length;
  const totalPending = platforms.reduce((sum, p) => sum + p.pendingReservations, 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🔄 Synchronisation</h1>
          <p className="text-gray-600 mt-1">Gérez vos connexions avec les plateformes de réservation</p>
        </div>
        
        <button
          onClick={handleSyncAll}
          disabled={syncing || connectedCount === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={20} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Synchronisation...' : 'Tout synchroniser'}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <LinkIcon className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{connectedCount}</p>
              <p className="text-sm text-gray-600">Plateformes connectées</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{totalPending}</p>
              <p className="text-sm text-gray-600">Réservations à importer</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Zap className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">Auto</p>
              <p className="text-sm text-gray-600">Synchronisation activée</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="font-medium text-blue-900 mb-1">💡 Synchronisation automatique</p>
            <p className="text-sm text-blue-800">
              Les réservations, calendriers et messages sont synchronisés automatiquement toutes les 30 minutes. 
              Vous pouvez aussi lancer une synchronisation manuelle à tout moment.
            </p>
          </div>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {platforms.map(platform => (
          <div key={platform.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{platform.logo}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{platform.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {platform.connected ? (
                        <>
                          <span className="flex items-center gap-1 text-sm text-green-600">
                            <Check size={16} />
                            Connecté
                          </span>
                          {platform.lastSync && (
                            <span className="text-sm text-gray-500">
                              • Sync {formatTime(platform.lastSync)}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <X size={16} />
                          Non connecté
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {platform.pendingReservations > 0 && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                    {platform.pendingReservations} en attente
                  </span>
                )}
              </div>

              {platform.connected && (
                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Propriétés liées</p>
                    <p className="text-2xl font-bold text-gray-900">{platform.propertiesLinked}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Réservations</p>
                    <p className="text-2xl font-bold text-gray-900">{platform.pendingReservations}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {platform.connected ? (
                  <>
                    <button
                      onClick={() => handleSyncAll()}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Synchroniser
                    </button>
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Settings size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <LinkIcon size={16} />
                    Connecter
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sync Logs */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Historique de synchronisation</h2>
        
        <div className="space-y-3">
          {syncLogs.map(log => (
            <div
              key={log.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`p-2 rounded-lg ${getStatusColor(log.status)}`}>
                {getStatusIcon(log.status)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{log.platform}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{log.action}</span>
                </div>
                <p className="text-sm text-gray-600">{log.details}</p>
              </div>
              
              <div className="text-sm text-gray-500">
                {formatTime(log.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <Download size={32} className="mb-3" />
          <h3 className="font-bold text-lg mb-2">Import automatique</h3>
          <p className="text-sm text-blue-100">
            Les nouvelles réservations sont automatiquement importées dans votre calendrier
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
          <Upload size={32} className="mb-3" />
          <h3 className="font-bold text-lg mb-2">Export des disponibilités</h3>
          <p className="text-sm text-green-100">
            Vos disponibilités sont synchronisées sur toutes les plateformes en temps réel
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <Zap size={32} className="mb-3" />
          <h3 className="font-bold text-lg mb-2">Synchronisation rapide</h3>
          <p className="text-sm text-purple-100">
            Toutes les 30 minutes ou manuellement à la demande
          </p>
        </div>
      </div>
    </div>
  );
};

export default SyncModule;
