
import React, { useState } from 'react';
import { Home, Calendar, DollarSign, Wrench, TrendingUp, AlertCircle, Share2, User, Clock, CheckCircle, Globe, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import { RESERVATIONS, PROPERTIES, TICKETS, CONVERSATIONS, EXPENSES } from '../services/mockData';
import { Reservation } from '../types';
import { Modal } from './ui/Modal';
import { format } from 'date-fns';

interface DashboardProps {
  onNavigate: (view: string, date?: Date) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // --- CALCULS DYNAMIQUES ---
  
  // 1. Messagerie
  const unreadMessages = CONVERSATIONS.reduce((acc, curr) => acc + curr.unreadCount, 0);
  
  // 2. Finance (Estimations basiques sur les réservations confirmées)
  const totalRevenue = RESERVATIONS
    .filter(r => r.status === 'confirmed')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  
  // 3. Maintenance active
  const activeTickets = TICKETS.filter(t => t.status !== 'resolved').length;

  const stats = [
    { 
        id: 1, 
        title: 'Messagerie', 
        value: unreadMessages > 0 ? `${unreadMessages} non lus` : 'À jour', 
        change: unreadMessages > 0 ? 'Action requise' : '',
        icon: MessageSquare, 
        color: unreadMessages > 0 ? 'bg-red-500' : 'bg-blue-500', 
        target: 'messages',
        alert: unreadMessages > 0
    },
    { 
        id: 2, 
        title: 'Calendrier', 
        value: `${RESERVATIONS.length} Résas`, 
        change: '+12%', 
        icon: Calendar, 
        color: 'bg-green-500', 
        target: 'calendar' 
    },
    { 
        id: 3, 
        title: 'Revenus', 
        value: `${totalRevenue.toLocaleString()} €`, 
        change: '+8%', 
        icon: DollarSign, 
        color: 'bg-purple-500', 
        target: 'finance' 
    },
    { 
        id: 4, 
        title: 'Maintenance', 
        value: `${activeTickets} Tickets`, 
        change: activeTickets > 0 ? '-2' : '0', 
        icon: Wrench, 
        color: 'bg-orange-500', 
        target: 'operations' 
    },
  ];

  const handleCopyGuestLink = () => {
      const baseUrl = window.location.href.split('#')[0];
      const link = `${baseUrl}#guest-guide`;
      window.prompt("Copiez ce lien pour le voyageur (Ctrl+C / Cmd+C) :", link);
  };

  const handleOpenBookingSite = () => {
      window.location.hash = '#booking';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'blocked': return 'bg-gray-100 text-gray-700';
      case 'cleaning': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div>
      {/* HEADER & ACTIONS PRINCIPALES */}
      <div className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
         <div>
             <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de Bord</h2>
             <p className="text-gray-600 mt-1">Bienvenue sur votre espace de gestion</p>
         </div>
         
         <div className="flex flex-wrap gap-3">
             {/* Raccourcis Modules */}
             <button 
                onClick={() => onNavigate('finance')}
                className="hidden md:flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
             >
                 <Plus size={16} /> Dépense
             </button>
             <button 
                onClick={() => onNavigate('messages')}
                className="hidden md:flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
             >
                 <MessageSquare size={16} /> Message
             </button>

             {/* Liens Publics */}
             <div className="h-8 w-px bg-gray-300 hidden md:block mx-1"></div>

             <button 
                onClick={handleOpenBookingSite}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors active:scale-95"
             >
                 <Globe size={18} />
                 Site Vitrine
             </button>
             <button 
                onClick={handleCopyGuestLink}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-green-700 transition-colors active:scale-95"
             >
                 <Share2 size={18} />
                 Guide
             </button>
         </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
                key={stat.id} 
                onClick={() => { if (stat.target) onNavigate(stat.target); }}
                className={`bg-white rounded-xl shadow-sm p-5 border border-transparent transition-all duration-200 group ${stat.target ? 'cursor-pointer hover:shadow-md hover:border-blue-200 hover:-translate-y-1' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.color} p-3 rounded-lg shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className="text-white" />
                </div>
                {stat.change && (
                    <span className={`text-xs font-bold px-2 py-1 rounded ${stat.alert ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-green-100 text-green-700'}`}>
                        {stat.change}
                    </span>
                )}
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              {stat.target && (
                  <div className="mt-2 flex items-center text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Accéder <ArrowRight size={12} className="ml-1" />
                  </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* GRAPHIQUE REVENUS CSS */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2 cursor-pointer border border-transparent hover:border-blue-200 transition-colors" onClick={() => onNavigate('finance')}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Évolution des Revenus</h3>
                    <p className="text-sm text-gray-500">6 derniers mois</p>
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <TrendingUp size={16} /> +8%
                </div>
            </div>
            
            <div className="h-64 w-full flex items-end justify-between gap-4 pt-8 border-b border-gray-100 pb-2">
                {/* Données simulées pour le graphique */}
                {[
                    {label: 'Jan', val: 40}, {label: 'Fév', val: 35}, {label: 'Mar', val: 55}, 
                    {label: 'Avr', val: 48}, {label: 'Mai', val: 70}, {label: 'Juin', val: 85}
                ].map((d) => (
                    <div key={d.label} className="flex flex-col items-center gap-2 w-full h-full justify-end group">
                        <div className="w-full max-w-[60px] bg-blue-50 rounded-t-lg relative h-full flex items-end overflow-hidden">
                            <div 
                                style={{ height: `${d.val}%` }} 
                                className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 relative group-hover:bg-blue-600"
                            ></div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{d.label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* DERNIÈRES RÉSERVATIONS */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Arrivées & Départs</h3>
            <button onClick={() => onNavigate('calendar')} className="text-blue-600 text-sm font-medium hover:underline">Tout voir</button>
          </div>
          <div className="space-y-4">
            {RESERVATIONS.slice(0, 4).map((res) => (
              <div 
                key={res.id} 
                onClick={() => setSelectedReservation(res)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors border border-transparent hover:border-blue-100"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 truncate">{res.guestName}</p>
                  <p className="text-xs text-gray-500 uppercase font-bold mt-0.5">{PROPERTIES.find(p => p.id === res.propertyId)?.name}</p>
                </div>
                <div className="text-right ml-4">
                   <p className="text-sm font-medium text-gray-900">{format(res.checkIn, 'dd/MM')}</p>
                   <span className={`inline-block text-[10px] px-2 py-1 rounded-full ${getStatusColor(res.status)}`}>
                      {res.status.toUpperCase()}
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALERTS & MAINTENANCE */}
        <div className="bg-white rounded-xl shadow-sm p-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">À Traiter</h3>
              <button onClick={() => onNavigate('operations')} className="text-blue-600 text-sm font-medium hover:underline">Gérer</button>
           </div>
           <div className="space-y-3">
              {/* Tickets */}
              {TICKETS.slice(0, 3).map((ticket) => (
                 <div key={ticket.id} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onNavigate('operations')}>
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                       ticket.priority === 'high' ? 'bg-red-500' : 'bg-orange-400'
                    }`} />
                    <div className="ml-3 flex-1">
                       <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{ticket.title}</p>
                          <span className="text-xs text-gray-400">{ticket.createdAt.toLocaleDateString()}</span>
                       </div>
                       <p className="text-xs text-gray-500 mt-1 line-clamp-1">{ticket.description}</p>
                    </div>
                 </div>
              ))}
              
              {/* Fake Alert Example */}
              <div className="flex items-center p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 cursor-pointer" onClick={() => onNavigate('finance')}>
                 <AlertCircle size={16} className="mr-3 flex-shrink-0" />
                 <div>
                     <span className="text-sm font-bold block">Facture en attente</span>
                     <span className="text-xs opacity-80">EDF - Le Cottage (85.50€)</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* MODAL DETAILS RESERVATION */}
      <Modal isOpen={!!selectedReservation} onClose={() => setSelectedReservation(null)} title="Détails Réservation">
          {selectedReservation && (
              <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <User size={24} />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-gray-900">{selectedReservation.guestName}</h3>
                        <p className="text-sm text-gray-500 capitalize">{selectedReservation.source} • {selectedReservation.guestCount || 2} pers.</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="border p-3 rounded-lg text-center">
                          <div className="text-xs text-gray-400 font-bold uppercase mb-1">Arrivée</div>
                          <div className="font-bold text-gray-900">{format(selectedReservation.checkIn, 'dd MMM')}</div>
                          <div className="text-xs text-gray-500">15:00</div>
                      </div>
                      <div className="border p-3 rounded-lg text-center">
                          <div className="text-xs text-gray-400 font-bold uppercase mb-1">Départ</div>
                          <div className="font-bold text-gray-900">{format(selectedReservation.checkOut, 'dd MMM')}</div>
                          <div className="text-xs text-gray-500">11:00</div>
                      </div>
                  </div>

                  <div className="space-y-2">
                     <button 
                        onClick={() => { onNavigate('calendar', selectedReservation.checkIn); setSelectedReservation(null); }}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                     >
                        Voir dans le Calendrier
                     </button>
                     <button 
                        onClick={() => { onNavigate('messages'); setSelectedReservation(null); }}
                        className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                     >
                        <MessageSquare size={18} /> Envoyer un message
                     </button>
                  </div>
              </div>
          )}
      </Modal>
    </div>
  );
};

export default Dashboard;
