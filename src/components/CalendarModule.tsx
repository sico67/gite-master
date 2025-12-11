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
  // État pour le formulaire
  const [formBooking, setFormBooking] = useState<Partial<Booking>>({});


  useEffect(() => {
    loadBookings();
    loadProperties();
  }, []);

  const loadBookings = async () => {
    // Simuler le chargement des réservations
    const loadedBookings: Booking[] = await DataService.getBookings(); // Supposition
    setBookings(loadedBookings);
  };
  
  const loadProperties = async () => {
    try {
        // CORRECTION: Utilisation de DataService.getProperties() au lieu de getAllProperties()
        const loadedProperties = await DataService.getProperties(); 
        setProperties(loadedProperties);
    } catch (error) {
        console.error("Erreur lors du chargement des propriétés:", error);
    }
  };

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-t-xl border-b border-gray-200">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return (
      <div className="grid grid-cols-7 text-center font-medium text-gray-600 border-b border-gray-200 bg-gray-50">
        {dayNames.map(day => <div key={day} className="p-2">{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const dateStart = new Date(monthStart);
    // Correction de l'erreur potentielle de dateStart
    dateStart.setDate(dateStart.getDate() - (firstDayOfMonth(monthStart) === 0 ? 6 : firstDayOfMonth(monthStart) - 1));

    const days = [];
    let day = dateStart;
    
    // Pour afficher 6 semaines complètes
    for (let i = 0; i < 42; i++) {
      const dayDate = new Date(day);
      const isCurrentMonth = dayDate.getMonth() === currentDate.getMonth();
      const isToday = dayDate.toDateString() === new Date().toDateString();
      
      const dayBookings = bookings.filter(booking => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        
        // La réservation est active à cette date (inclus checkIn, exclu checkOut)
        return dayDate >= checkIn && dayDate < checkOut;
      });

      days.push(
        <div 
          key={i} 
          className={`h-32 p-1 border border-gray-200 relative overflow-y-auto ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'} ${isToday ? 'bg-blue-100 border-blue-400' : ''}`}
          onClick={() => handleDayClick(dayDate)}
        >
          <span className={`text-sm font-medium ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}`}>{dayDate.getDate()}</span>
          
          <div className="mt-1 space-y-1">
            {dayBookings.map((booking) => (
              <div 
                key={booking.id}
                className="bg-green-500 text-white text-xs rounded-sm p-1 cursor-pointer truncate hover:bg-green-600"
                onClick={(e) => {
                  e.stopPropagation(); // Empêche l'ouverture du formulaire d'ajout
                  handleViewDetails(booking);
                }}
              >
                {booking.propertyName} ({booking.guestName.split(' ')[0]})
              </div>
            ))}
          </div>
        </div>
      );
      day.setDate(day.getDate() + 1);
    }

    return (
      <div className="grid grid-cols-7">
        {days}
      </div>
    );
  };
  
  const handleDayClick = (date: Date) => {
    // Pré-remplir le formulaire avec la date du jour cliqué
    const dateString = date.toISOString().split('T')[0];
    setSelectedBooking(null);
    setFormBooking({ 
        checkIn: dateString,
        checkOut: dateString,
        propertyId: properties.length > 0 ? properties[0].id : '', // Sélectionne la première propriété par défaut
    });
    setShowModal(true);
  };
  
  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };
  
  const handleEditFromDetails = (booking: Booking) => {
      setSelectedBooking(booking);
      setFormBooking(booking);
      setShowDetailsModal(false);
      setShowModal(true);
  };
  
  const handleDeleteFromDetails = (booking: Booking) => {
      handleDeleteBooking(booking.id);
      setShowDetailsModal(false);
      setSelectedBooking(null);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setFormBooking(booking);
    setShowModal(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormBooking(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveBooking = async () => {
      if (!formBooking.guestName || !formBooking.checkIn || !formBooking.checkOut || !formBooking.propertyId) {
          alert("Veuillez remplir les champs obligatoires (Nom, Arrivée, Départ, Propriété).");
          return;
      }
      
      const property = properties.find(p => p.id === formBooking.propertyId);
      
      const bookingToSave: Booking = {
          ...formBooking as Booking,
          id: formBooking.id || `temp-${Date.now()}`,
          propertyName: property ? property.name : 'Inconnu',
          status: formBooking.status || 'confirmed',
          totalPrice: parseFloat(formBooking.totalPrice as any) || 0,
          guests: parseInt(formBooking.guests as any) || 1,
          adults: parseInt(formBooking.adults as any) || (parseInt(formBooking.guests as any) || 1),
          children: parseInt(formBooking.children as any) || 0,
          source: formBooking.source || 'manual',
          createdAt: formBooking.createdAt || new Date().toISOString(),
      };
      
      if (selectedBooking) {
          await DataService.updateBooking(bookingToSave);
      } else {
          await DataService.addBooking(bookingToSave);
      }
      
      loadBookings();
      setShowModal(false);
      setSelectedBooking(null);
      setFormBooking({});
  };
  
  const handleDeleteBooking = async (id: string) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
          await DataService.deleteBooking(id);
          loadBookings();
          setShowModal(false);
          setSelectedBooking(null);
      }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <CalendarIcon size={32} /> Calendrier des Réservations
        </h1>
        <button 
            onClick={() => {
                setSelectedBooking(null);
                setFormBooking({ 
                    propertyId: properties.length > 0 ? properties[0].id : '',
                    checkIn: new Date().toISOString().split('T')[0],
                    checkOut: new Date().toISOString().split('T')[0],
                });
                setShowModal(true);
            }} 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus size={20} /> Nouvelle Réservation
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      {/* Modal Ajout/Modification Réservation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-2xl font-semibold">
                {selectedBooking ? 'Modifier la Réservation' : 'Ajouter une Réservation'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                {/* Propriété */}
                <div>
                    <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"><Home size={16} /> Propriété</label>
                    <select
                        name="propertyId"
                        id="propertyId"
                        value={formBooking.propertyId || ''}
                        onChange={handleFormChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="" disabled>Sélectionner une propriété</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                
                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">Date d'Arrivée</label>
                        <input
                            type="date"
                            name="checkIn"
                            id="checkIn"
                            value={formBooking.checkIn || ''}
                            onChange={handleFormChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">Date de Départ</label>
                        <input
                            type="date"
                            name="checkOut"
                            id="checkOut"
                            value={formBooking.checkOut || ''}
                            onChange={handleFormChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Nom du client */}
                <div>
                    <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"><User size={16} /> Nom du Client</label>
                    <input
                        type="text"
                        name="guestName"
                        id="guestName"
                        value={formBooking.guestName || ''}
                        onChange={handleFormChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Ex: Dupont Jean"
                        required
                    />
                </div>
                
                {/* Contact */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"><Mail size={16} /> Email</label>
                        <input
                            type="email"
                            name="guestEmail"
                            id="guestEmail"
                            value={formBooking.guestEmail || ''}
                            onChange={handleFormChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="jean.dupont@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"><Phone size={16} /> Téléphone</label>
                        <input
                            type="tel"
                            name="guestPhone"
                            id="guestPhone"
                            value={formBooking.guestPhone || ''}
                            onChange={handleFormChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="+33 6 00 00 00 00"
                        />
                    </div>
                </div>
                
                {/* Détails financiers/personnes */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"><DollarSign size={16} /> Prix Total</label>
                        <input
                            type="number"
                            name="totalPrice"
                            id="totalPrice"
                            value={formBooking.totalPrice || ''}
                            onChange={handleFormChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label htmlFor="guests" className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"><User size={16} /> Total Personnes</label>
                        <input
                            type="number"
                            name="guests"
                            id="guests"
                            value={formBooking.guests || ''}
                            onChange={handleFormChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="1"
                        />
                    </div>
                    <div>
                        <label htmlFor="source" className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">Source</label>
                        <select
                            name="source"
                            id="source"
                            value={formBooking.source || 'manual'}
                            onChange={handleFormChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="manual">Manuelle</option>
                            <option value="airbnb">Airbnb</option>
                            <option value="booking">Booking.com</option>
                            <option value="direct">Directe</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t mt-4">
              {selectedBooking && (
                <button
                  onClick={() => handleDeleteBooking(selectedBooking.id)}
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

      {/* Modal Détails Réservation - CORRECTION DE LA SIGNATURE DES PROPS onEdit/onDelete */}
      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBooking(null);
          }}
          // CORRECTION: onEdit et onDelete reçoivent la réservation comme argument
          onEdit={(booking: Booking) => handleEditFromDetails(booking)} 
          onDelete={(booking: Booking) => handleDeleteFromDetails(booking)}
        />
      )}
    </div>
  );
};

// CORRECTION: Assurez-vous qu'il n'y a qu'un seul export default.
export default CalendarModule;