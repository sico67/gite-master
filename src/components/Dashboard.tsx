import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  Home,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface Booking {
  id: string;
  guest: string;
  property: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'checked-in';
  revenue: number;
}

interface Task {
  id: string;
  title: string;
  type: 'urgent' | 'normal';
  dueDate: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    monthRevenue: 4850,
    monthRevenueChange: 12.5,
    totalBookings: 18,
    bookingsChange: 8.3,
    occupancyRate: 76,
    occupancyChange: -3.2,
    avgRating: 4.8,
    ratingChange: 0.2,
  });

  const [upcomingBookings] = useState<Booking[]>([
    {
      id: '1',
      guest: 'Marie Dubois',
      property: 'Villa Exemple',
      checkIn: '2025-12-12',
      checkOut: '2025-12-19',
      status: 'confirmed',
      revenue: 980
    },
    {
      id: '2',
      guest: 'Jean Martin',
      property: 'Villa Exemple',
      checkIn: '2025-12-15',
      checkOut: '2025-12-18',
      status: 'pending',
      revenue: 420
    },
    {
      id: '3',
      guest: 'Sophie Laurent',
      property: 'Villa Exemple',
      checkIn: '2025-12-20',
      checkOut: '2025-12-27',
      status: 'confirmed',
      revenue: 1260
    },
  ]);

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Ménage avant arrivée Marie Dubois',
      type: 'urgent',
      dueDate: '2025-12-11'
    },
    {
      id: '2',
      title: 'Répondre à demande de Jean Martin',
      type: 'normal',
      dueDate: '2025-12-10'
    },
    {
      id: '3',
      title: 'Taxe de séjour à déclarer',
      type: 'urgent',
      dueDate: '2025-12-15'
    },
  ]);

  const [revenueData] = useState([
    { month: 'Jan', revenue: 3200 },
    { month: 'Fév', revenue: 2800 },
    { month: 'Mar', revenue: 4100 },
    { month: 'Avr', revenue: 3900 },
    { month: 'Mai', revenue: 5200 },
    { month: 'Juin', revenue: 6800 },
    { month: 'Juil', revenue: 7500 },
    { month: 'Août', revenue: 8200 },
    { month: 'Sep', revenue: 5400 },
    { month: 'Oct', revenue: 4200 },
    { month: 'Nov', revenue: 3800 },
    { month: 'Déc', revenue: 4850 },
  ]);

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'checked-in': return 'En cours';
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    const target = new Date(dateStr);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              stats.monthRevenueChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.monthRevenueChange > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              {Math.abs(stats.monthRevenueChange)}%
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{stats.monthRevenue.toLocaleString()}€</p>
            <p className="text-sm text-gray-600 mt-1">Revenus ce mois</p>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              stats.bookingsChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.bookingsChange > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              {Math.abs(stats.bookingsChange)}%
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
            <p className="text-sm text-gray-600 mt-1">Réservations ce mois</p>
          </div>
        </div>

        {/* Occupancy */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Home className="text-purple-600" size={24} />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              stats.occupancyChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.occupancyChange > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              {Math.abs(stats.occupancyChange)}%
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{stats.occupancyRate}%</p>
            <p className="text-sm text-gray-600 mt-1">Taux d'occupation</p>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="text-yellow-600" size={24} />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              stats.ratingChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.ratingChange > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              {Math.abs(stats.ratingChange)}
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
            <p className="text-sm text-gray-600 mt-1">Note moyenne</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenus mensuels</h2>
            <div className="text-sm text-gray-600">2025</div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {revenueData.map((data, index) => {
              const height = (data.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                      style={{ height: `${height}%`, minHeight: '8px' }}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.revenue.toLocaleString()}€
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Tâches</h2>
            <span className="text-sm text-gray-600">{tasks.length} en cours</span>
          </div>
          
          <div className="space-y-3">
            {tasks.map(task => {
              const daysUntil = getDaysUntil(task.dueDate);
              return (
                <div 
                  key={task.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    task.type === 'urgent' 
                      ? 'bg-red-50 border-red-500' 
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                        <Clock size={12} />
                        <span>
                          {daysUntil === 0 && "Aujourd'hui"}
                          {daysUntil === 1 && "Demain"}
                          {daysUntil > 1 && `Dans ${daysUntil} jours`}
                          {daysUntil < 0 && `En retard`}
                        </span>
                      </div>
                    </div>
                    {task.type === 'urgent' && (
                      <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Prochaines réservations</h2>
            <span className="text-sm text-gray-600">{upcomingBookings.length} réservations</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Propriété</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Arrivée</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Départ</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Statut</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Montant</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.map(booking => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {booking.guest.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-gray-900">{booking.guest}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{booking.property}</td>
                    <td className="py-4 px-4 text-gray-700">{formatDate(booking.checkIn)}</td>
                    <td className="py-4 px-4 text-gray-700">{formatDate(booking.checkOut)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-gray-900">{booking.revenue}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <button className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <Calendar size={32} className="mb-3" />
          <h3 className="font-bold text-lg mb-1">Nouvelle réservation</h3>
          <p className="text-sm text-blue-100">Ajouter une réservation manuellement</p>
        </button>
        
        <button className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <Users size={32} className="mb-3" />
          <h3 className="font-bold text-lg mb-1">Messagerie</h3>
          <p className="text-sm text-green-100">Contacter vos clients</p>
        </button>
        
        <button className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <TrendingUp size={32} className="mb-3" />
          <h3 className="font-bold text-lg mb-1">Rapports</h3>
          <p className="text-sm text-purple-100">Voir les statistiques détaillées</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
