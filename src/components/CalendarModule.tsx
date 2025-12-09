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
  notes?: string;
}

const CalendarModule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const savedBookings = DataService.getBookings();
    if (savedBookings.length > 0) {
      setBookings(savedBookings);
    } else {
      // Données démo initiales
      const demoBookings = [
        {
          id: '1',
          guestName: 'Marie Dubois',
          guestEmail: 'marie.dubois@email.com',
          guestPhone: '+33 6 12 34 56 78',
          propertyId: 'p1',
          propertyName: 'Villa Exemple',
          checkIn: '2025-12-12',
          checkOut: '2025-12-19',
          status: 'confirmed' as const,
          totalPrice: 980,
          guests: 4,
          adults: 3,
          children: 1,
          notes: 'Arrivée tardive prévue',
          source: 'manual' as const,
          createdAt: new Date().toISOString()
        }
      ];
      DataService.saveBookings(demoBookings);
      setBookings(demoBookings);
    }
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

  const properties = [
    { id: 'p1', name: 'Villa Exemple', pricePerNight: 140 }
  ];

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
      const updated = { ...formData, id: selectedBooking.id } as Booking;
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
        createdAt: new Date().toISOString()
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
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          <span>Nouvelle réservation</span>
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Calendar Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between text-white">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <h2 className="text-xl font-bold capitalize">
            {formatDate(currentDate)}
          </h2>
          
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="p-2 md:p-3 text-center text-sm font-semibold text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Guest Info */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-blue-600" />
                  Informations client
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => handleFormChange('guestName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.guestEmail}
                        onChange={(e) => handleFormChange('guestEmail', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="jean@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.guestPhone}
                        onChange={(e) => handleFormChange('guestPhone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Home size={18} className="text-blue-600" />
                  Détails de la réservation
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Propriété *
                    </label>
                    <select
                      value={formData.propertyId}
                      onChange={(e) => {
                        const property = properties.find(p => p.id === e.target.value);
                        handleFormChange('propertyId', e.target.value);
                        handleFormChange('propertyName', property?.name || '');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {properties.map(property => (
                        <option key={property.id} value={property.id}>
                          {property.name} ({property.pricePerNight}€/nuit)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'arrivée *
                      </label>
                      <input
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => handleFormChange('checkIn', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de départ *
                      </label>
                      <input
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => handleFormChange('checkOut', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de voyageurs
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.guests}
                        onChange={(e) => handleFormChange('guests', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleFormChange('status', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </div>
                  </div>

                  {formData.checkIn && formData.checkOut && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-700">Nombre de nuits :</span>
                        <span className="font-bold text-gray-900">
                          {calculateNights(formData.checkIn, formData.checkOut)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span className="text-gray-900 flex items-center gap-2">
                          <DollarSign size={20} className="text-blue-600" />
                          Prix total :
                        </span>
                        <span className="text-blue-600">{formData.totalPrice}€</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (optionnel)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Remarques particulières..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex flex-col md:flex-row gap-3 sticky bottom-0 bg-white">
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
