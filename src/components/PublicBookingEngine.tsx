
import React, { useState } from 'react';
import { MapPin, Users, Wifi, Star, ArrowRight, CheckCircle, Calendar, ArrowLeft, Info } from 'lucide-react';
import { PROPERTIES, RESERVATIONS } from '../services/mockData';
import { Property } from '../types';
import { format, addDays, isWithinInterval, startOfDay, differenceInDays } from 'date-fns';

interface PublicBookingEngineProps {
    onExit: () => void;
}

export const PublicBookingEngine: React.FC<PublicBookingEngineProps> = ({ onExit }) => {
    const [view, setView] = useState<'list' | 'detail' | 'success'>('list');
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        guestName: '',
        guestEmail: ''
    });

    const handlePropertyClick = (property: Property) => {
        setSelectedProperty(property);
        setView('detail');
        // Reset form
        setBookingData({ ...bookingData, checkIn: '', checkOut: '', guests: 1 });
    };

    const calculateTotal = () => {
        if (!selectedProperty || !bookingData.checkIn || !bookingData.checkOut) return 0;
        const start = new Date(bookingData.checkIn);
        const end = new Date(bookingData.checkOut);
        const nights = differenceInDays(end, start);
        return nights > 0 ? nights * selectedProperty.pricePerNight : 0;
    };

    const isDateBlocked = (dateStr: string) => {
        if (!selectedProperty) return false;
        const targetDate = startOfDay(new Date(dateStr));
        
        return RESERVATIONS.some(res => {
            if (res.propertyId !== selectedProperty.id) return false;
            // Statut 'cleaning' ou 'blocked' ou 'confirmed' bloque la date
            return isWithinInterval(targetDate, {
                start: startOfDay(res.checkIn),
                end: startOfDay(res.checkOut)
            });
        });
    };

    const handleSubmitBooking = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation simple
        if (isDateBlocked(bookingData.checkIn) || isDateBlocked(bookingData.checkOut)) {
            alert("Certaines dates sélectionnées ne sont plus disponibles.");
            return;
        }

        // Simulation d'envoi
        setTimeout(() => {
            setView('success');
            // On ajouterait ici la réservation dans le Mock Data en réalité
        }, 1000);
    };

    // --- VUE 1: SUCCÈS ---
    if (view === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle size={48} className="text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Réservation Confirmée !</h1>
                <p className="text-gray-600 max-w-md mb-8">
                    Merci {bookingData.guestName}. Votre séjour à <strong>{selectedProperty?.name}</strong> est validé. Un email de confirmation a été envoyé à {bookingData.guestEmail}.
                </p>
                <button 
                    onClick={() => { setView('list'); setSelectedProperty(null); }}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                    Retour au Catalogue
                </button>
            </div>
        );
    }

    // --- VUE 2: DÉTAILS & RÉSERVATION ---
    if (view === 'detail' && selectedProperty) {
        return (
            <div className="min-h-screen bg-white">
                {/* Hero Image */}
                <div className="relative h-[40vh] md:h-[50vh]">
                    <img 
                        src={selectedProperty.imageUrl} 
                        className="w-full h-full object-cover"
                        alt={selectedProperty.name}
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-transparent"></div>
                    <button 
                        onClick={() => setView('list')}
                        className="absolute top-6 left-6 bg-white/90 backdrop-blur text-gray-800 px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-white transition-colors"
                    >
                        <ArrowLeft size={18} /> Retour
                    </button>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-8 -mt-20 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProperty.name}</h1>
                                    <p className="flex items-center text-gray-500">
                                        <MapPin size={18} className="mr-1 text-blue-500" /> {selectedProperty.address}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-600">{selectedProperty.pricePerNight}€</p>
                                    <p className="text-sm text-gray-400">par nuit</p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6 border-t pt-6">
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                                    <Users size={20} className="text-gray-600" />
                                    <span className="font-medium">{selectedProperty.capacity} Voyageurs</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                                    <Star size={20} className="text-yellow-500 fill-yellow-500" />
                                    <span className="font-medium">4.9 (128 avis)</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-3">À propos</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {selectedProperty.description}
                                </p>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-3">Équipements</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {selectedProperty.amenities.map(am => (
                                        <div key={am} className="flex items-center gap-2 text-gray-600">
                                            <CheckCircle size={16} className="text-green-500" /> {am}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-6">
                            <h3 className="text-xl font-bold mb-4">Réserver votre séjour</h3>
                            <form onSubmit={handleSubmitBooking} className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Arrivée</label>
                                        <input 
                                            required
                                            type="date" 
                                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={bookingData.checkIn}
                                            onChange={e => setBookingData({...bookingData, checkIn: e.target.value})}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Départ</label>
                                        <input 
                                            required
                                            type="date" 
                                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={bookingData.checkOut}
                                            onChange={e => setBookingData({...bookingData, checkOut: e.target.value})}
                                            min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Voyageurs</label>
                                    <select 
                                        className="w-full border rounded-lg p-2.5"
                                        value={bookingData.guests}
                                        onChange={e => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                                    >
                                        {[...Array(selectedProperty.capacity)].map((_, i) => (
                                            <option key={i} value={i+1}>{i+1} voyageur{i>0 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="border-t pt-4 mt-4 space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>{selectedProperty.pricePerNight}€ x {differenceInDays(new Date(bookingData.checkOut || 0), new Date(bookingData.checkIn || 0)) || 0} nuits</span>
                                        <span>{calculateTotal()}€</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Frais de ménage</span>
                                        <span>50€</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>Total</span>
                                        <span>{calculateTotal() > 0 ? calculateTotal() + 50 : 0}€</span>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <input 
                                        required
                                        type="text" placeholder="Votre Nom Complet"
                                        className="w-full border rounded-lg p-3"
                                        value={bookingData.guestName}
                                        onChange={e => setBookingData({...bookingData, guestName: e.target.value})}
                                    />
                                    <input 
                                        required
                                        type="email" placeholder="Votre Email"
                                        className="w-full border rounded-lg p-3"
                                        value={bookingData.guestEmail}
                                        onChange={e => setBookingData({...bookingData, guestEmail: e.target.value})}
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={calculateTotal() === 0}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Payer et Réserver
                                </button>
                                <p className="text-center text-xs text-gray-400">Paiement sécurisé par Stripe (Simulation)</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- VUE 1: CATALOGUE (LISTE) ---
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-blue-600">
                        <Star className="fill-blue-600" />
                        <span className="text-xl font-bold tracking-tight">Gîte Master Holidays</span>
                    </div>
                    <button onClick={onExit} className="text-sm font-medium text-gray-500 hover:text-gray-900">
                        Espace Propriétaire
                    </button>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="bg-blue-600 text-white py-16 px-4 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Trouvez votre prochaine escapade</h1>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                    Réservez en direct auprès des propriétaires. Meilleur prix garanti, 0% de frais de service.
                </p>
            </div>

            {/* Listings */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PROPERTIES.map(property => (
                        <div 
                            key={property.id}
                            onClick={() => handlePropertyClick(property)}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src={property.imageUrl} 
                                    alt={property.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    À partir de {property.pricePerNight}€
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                        {property.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm font-bold">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        4.9
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 flex items-center">
                                    <MapPin size={14} className="mr-1" /> {property.address}
                                </p>
                                
                                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                    <span className="bg-gray-100 px-2 py-1 rounded">{property.capacity} pers.</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">{property.amenities[0]}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">Wifi</span>
                                </div>

                                <button className="w-full flex items-center justify-center gap-2 text-blue-600 font-bold border border-blue-100 rounded-lg py-2 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    Voir disponibilités <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-900 text-gray-400 py-12 text-center text-sm">
                <p>© 2024 Gîte Master Holidays. Tous droits réservés.</p>
            </div>
        </div>
    );
};
