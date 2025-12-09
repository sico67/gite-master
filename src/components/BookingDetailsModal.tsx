import React, { useState } from 'react';
import { X, Edit, Trash2, MessageCircle, ClipboardList, Calendar, User, Mail, Phone, MapPin, DollarSign, Users } from 'lucide-react';
import DataService from '../services/DataService';

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
}

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  onClose,
  onEdit,
  onDelete
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const calculateNights = () => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const pricePerNight = booking.totalPrice / nights;
  const touristTax = booking.adults * nights * 0.80;

  const getStatusBadge = () => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    const labels = {
      confirmed: 'Confirmée',
      pending: 'En attente',
      cancelled: 'Annulée'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[booking.status]}`}>
        {labels[booking.status]}
      </span>
    );
  };

  const getSourceBadge = () => {
    const styles = {
      direct: 'bg-blue-100 text-blue-800',
      airbnb: 'bg-pink-100 text-pink-800',
      booking: 'bg-indigo-100 text-indigo-800',
      manual: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      direct: 'Site Direct',
      airbnb: 'Airbnb',
      booking: 'Booking.com',
      manual: 'Manuel'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[booking.source]}`}>
        {labels[booking.source]}
      </span>
    );
  };

  const cleaningTask = DataService.getCleaningTasks().find(t => t.bookingId === booking.id);

  const handleMessage = () => {
    alert(`Ouvrir messagerie avec ${booking.guestName}\n${booking.guestEmail}`);
  };

  const handleViewCleaning = () => {
    if (cleaningTask) {
      alert(`Tâche ménage : ${cleaningTask.scheduledDate} à ${cleaningTask.scheduledTime}\nStatut: ${cleaningTask.status}`);
    } else {
      alert('Aucune tâche de ménage associée');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{booking.guestName}</h2>
            <p className="text-blue-100 text-sm mt-1">Réservation #{booking.id.slice(-6)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Source */}
          <div className="flex items-center gap-4">
            {getStatusBadge()}
            {getSourceBadge()}
          </div>

          {/* Guest Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Informations client
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm font-medium">{booking.guestEmail}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Téléphone</div>
                  <div className="text-sm font-medium">{booking.guestPhone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              Détails de la réservation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Propriété</div>
                <div className="font-medium flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  {booking.propertyName}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Voyageurs</div>
                <div className="font-medium flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  {booking.adults} adultes {booking.children > 0 && `+ ${booking.children} enfants`}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Arrivée</div>
                <div className="font-medium">{new Date(booking.checkIn).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Départ</div>
                <div className="font-medium">{new Date(booking.checkOut).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-gray-500 mb-1">Durée</div>
                <div className="font-medium">{nights} {nights > 1 ? 'nuits' : 'nuit'}</div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign size={20} className="text-blue-600" />
              Tarification
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{nights} {nights > 1 ? 'nuits' : 'nuit'} × {pricePerNight.toFixed(2)}€</span>
                <span className="font-medium">{booking.totalPrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxe de séjour ({booking.adults} adultes × {nights} {nights > 1 ? 'nuits' : 'nuit'})</span>
                <span className="font-medium">{touristTax.toFixed(2)}€</span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-xl text-blue-600">{(booking.totalPrice + touristTax).toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="bg-yellow-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-700">{booking.notes}</p>
            </div>
          )}

          {/* Cleaning Task */}
          {cleaningTask && (
            <div className="bg-purple-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <ClipboardList size={18} className="text-purple-600" />
                Ménage associé
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{cleaningTask.scheduledDate} à {cleaningTask.scheduledTime}</div>
                  <div className="text-xs text-gray-600">Statut: {cleaningTask.status}</div>
                </div>
                <button
                  onClick={handleViewCleaning}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Voir détails →
                </button>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="text-xs text-gray-500 pt-4 border-t">
            Créée le {new Date(booking.createdAt).toLocaleDateString('fr-FR')} à {new Date(booking.createdAt).toLocaleTimeString('fr-FR')}
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
          <button
            onClick={handleMessage}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <MessageCircle size={18} />
            Message
          </button>
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <Edit size={18} />
            Modifier
          </button>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center gap-2 font-medium transition-colors"
            >
              <Trash2 size={18} />
            </button>
          ) : (
            <button
              onClick={onDelete}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-medium transition-colors"
            >
              Confirmer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
