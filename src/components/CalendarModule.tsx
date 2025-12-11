import React, { useState, useEffect } from 'react';
import DataService from '../services/DataService';
import BookingDetailsModal from './BookingDetailsModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  User,
  Home,
  DollarSign,
  Clock,
  Mail,
  Phone,
  Edit,
  Trash2,
  X
} from 'lucide-react';

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  propertyId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
  guests: number;
  adults: number;
  children: number;
  notes?: string;
  source: 'direct' | 'airbnb' | 'booking' | 'manual';
  createdAt: string;
  updatedAt?: string;
}

const CalendarModule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    loadBookings();
    loadProperties();
  }, []);

  const loadBookings = () => {
    const savedBookings = DataService.getBookings();
    setBookings(savedBookings);
  };

  const loadProperties = () => {
    // Importer PropertyService dynamiquement
    import('../services/PropertyService').then(({ default: PropertyService }) => {
      const allProps = PropertyService.getProperties(); // CORRIGÉ: Remplacé getAllProperties() par getProperties()
      setProperties(allProps);
      
      // Si aucune propriété sélectionnée, prendre la première active
      if (formData.propertyId === 'p1' && allProps.length > 0) {
        const firstProp = allProps[0];
        setFormData(prev => ({
          ...prev,
          propertyId: firstProp.id,
          propertyName: firstProp.name
        }));
      }
    });
  };

  const [formData, setFormData] = useState<Partial<Booking>>({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    propertyId: 'p1',
    propertyName: 'Villa Exemple',
    checkIn: '',
    checkOut: '',
    status: 'pending',
    totalPrice: 0,
    guests: 2,
    notes: ''
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const getBookingsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const currentDay = new Date(dateStr);
      return currentDay >= checkIn && currentDay < checkOut;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculatePrice = (checkIn: string, checkOut: string, propertyId: string) => {
    const nights = calculateNights(checkIn, checkOut);
    const property = properties.find(p => p.id === propertyId);
    return nights * (property?.pricePerNight || 140);
  };

  const handleFormChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    
    if (field === 'checkIn' || field === 'checkOut' || field === 'propertyId') {
      if (updated.checkIn && updated.checkOut && updated.propertyId) {
        updated.totalPrice = calculatePrice(updated.checkIn, updated.checkOut, updated.propertyId);
      }
    }
    
    setFormData(updated);
  };

  const handleAddBooking = () => {
    setSelectedBooking(null);
    setFormData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      propertyId: 'p1',
      propertyName: 'Villa Exemple',
      checkIn: '',
      checkOut: '',
      status: 'pending',
      totalPrice: 0,
      guests: 2,
      notes: ''
    });
    setShowModal(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleEditFromDetails = () => {
    setShowDetailsModal(false);
    if (selectedBooking) {
      setFormData(selectedBooking);
      setShowModal(true);
    }
  };

  const handleDeleteFromDetails = () => {
    if (selectedBooking) {
      DataService.deleteBooking(selectedBooking.id);
      loadBookings();
      setShowDetailsModal(false);
      setSelectedBooking(null);
    }
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      DataService.deleteBooking(id);
      loadBookings();
    }
  };

  const handleSaveBooking = () => {
    if (!formData.guestName || !formData.checkIn || !formData.checkOut) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (selectedBooking) {
      // Edit existing
      const updated = { 
        ...formData, 
        id: selectedBooking.id,
        adults: formData.guests || selectedBooking.adults || 2,
        children: selectedBooking.children || 0,
        source: selectedBooking.source || 'manual',
        createdAt: selectedBooking.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Booking;
      DataService.updateBooking(selectedBooking.id, updated);
      loadBookings();
    } else {
      // Add new
      const newBooking: Booking = {
        ...formData,
        id: Date.now().toString(),
        source: 'manual',
        adults: formData.guests || 2,
        children: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Booking;
      
      DataService.addBooking(newBooking, newBooking.status === 'confirmed');
      loadBookings();
      
      if (newBooking.status === 'confirmed') {
        alert('✅ Réservation créée !\n🧹 Tâche de ménage programmée automatiquement');
      }
    }

    setShowModal(false);
    setSelectedBooking(null);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-gray-50" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayBookings = getBookingsForDate(day);
    const isToday = 
      day === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear();

    days.push(
      <div
        key={day}
        onClick={() => {
          if (dayBookings.length === 0) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            setFormData({
              ...formData,
              checkIn: dateStr,
              checkOut: dateStr
            });
            setShowModal(true);
          }
        }}
        className={`h-24 md:h-32 border border-gray-200 p-1 md:p-2 overflow-hidden transition-colors ${
          isToday ? 'bg-blue-50 border-blue-400' : 'bg-white'
        } ${
          dayBookings.length === 0 ? 'cursor-pointer hover:bg-blue-50' : 'hover:bg-gray-50'
        }`}
      >
        <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayBookings.slice(0, 2).map(booking => (
            <div
              key={booking.id}
              onClick={() => handleEditBooking(booking)}
              className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getStatusColor(booking.status)}`}
            >
              <div className="font-medium truncate">{booking.guestName}</div>
            </div>
          ))}
          {dayBookings.length > 2 && (
            <div className="text-xs text-gray-600 pl-1">
              +{dayBookings.length - 2} autre(s)
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📅 Calendrier</h1>
          <p className="text-gray-600 mt-1">{bookings.length} réservation(s) ce mois</p>
        </div>
        
        <button
          onClick={handleAddBooking}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors font-medium"
        >
          <Plus size={20} /> Nouvelle réservation
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-6">
        <button 
          onClick={previousMonth} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-900 capitalize">
          {formatDate(currentDate)}
        </h2>
        <button 
          onClick={nextMonth} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-7 font-semibold text-center text-sm md:text-base text-gray-800 border-b border-gray-200 mb-2">
          <div className="py-2">Lun</div>
          <div className="py-2">Mar</div>
          <div className="py-2">Mer</div>
          <div className="py-2">Jeu</div>
          <div className="py-2">Ven</div>
          <div className="py-2 text-red-600">Sam</div>
          <div className="py-2 text-red-600">Dim</div>
        </div>
        
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
          <span className="text-gray-700">Confirmée</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded" />
          <span className="text-gray-700">En attente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
          <span className="text-gray-700">Annulée</span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarIcon size={24} className="text-blue-600" />
                {selectedBooking ? 'Modifier la réservation' : 'Nouvelle réservation'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <User size={16} /> Informations Client
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom du voyageur *</label>
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => handleFormChange('guestName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.guestEmail}
                        onChange={(e) => handleFormChange('guestEmail', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={formData.guestPhone}
                        onChange={(e) => handleFormChange('guestPhone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Home size={16} /> Détails du Séjour
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Propriété *</label>
                    <select
                      value={formData.propertyId}
                      onChange={(e) => {
                        const property = properties.find(p => p.id === e.target.value);
                        handleFormChange('propertyId', e.target.value);
                        handleFormChange('propertyName', property ? property.name : '');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {properties.map(prop => (
                        <option key={prop.id} value={prop.id}>{prop.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date d'arrivée *</label>
                      <input
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => handleFormChange('checkIn', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date de départ *</label>
                      <input
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => handleFormChange('checkOut', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de voyageurs</label>
                      <input
                        type="number"
                        value={formData.guests}
                        onChange={(e) => handleFormChange('guests', Number(e.target.value))}
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleFormChange('status', e.target.value as Booking['status'])}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="confirmed">Confirmée</option>
                        <option value="pending">En attente</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-medium text-gray-700 p-3 bg-gray-100 rounded-lg">
                    <span>Nuits :</span>
                    <span className="font-bold">{calculateNights(formData.checkIn || '', formData.checkOut || '')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <DollarSign size={16} /> Financement
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix Total (€)</label>
                    <input
                      type="number"
                      value={formData.totalPrice}
                      onChange={(e) => handleFormChange('totalPrice', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Calculé automatiquement par défaut: {calculatePrice(formData.checkIn || '', formData.checkOut || '', formData.propertyId || '')} €
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (privées)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex flex-col md:flex-row justify-between gap-3 sticky bottom-0 bg-white">
              {selectedBooking && (
                <button
                  onClick={() => {
                    handleDeleteBooking(selectedBooking.id);
                    setShowModal(false);
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 size={18} />
                  Supprimer
                </button>
              )}
              
              <div className="flex-1 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Annuler
                </button>
                
                <button
                  onClick={handleSaveBooking}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {selectedBooking ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails Réservation */}
      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBooking(null);
          }}
          onEdit={handleEditFromDetails}
          onDelete={handleDeleteFromDetails}
        />
      )}
    </div>
  );
};

export default CalendarModule;
export default CalendarModule;

// Déploiement forcé