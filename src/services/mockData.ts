
import { Property, Reservation, InventoryItem, MaintenanceTicket, Channel, Conversation, Message, MessageTemplate, Expense } from '../types';

// --- MOCK DATABASE ---

export const PROPERTIES: Property[] = [
  { 
    id: 'p1', 
    name: 'Le Cottage Charmant', 
    address: '12 Rue des Fleurs, Annecy',
    pricePerNight: 120,
    capacity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1000',
    description: 'Un cottage romantique au cœur des montagnes. Idéal pour les couples ou petites familles.',
    amenities: ['Wifi', 'Jardin', 'Parking Gratuit', 'Cuisine Équipée']
  },
  { 
    id: 'p2', 
    name: 'Villa des Pins Maritimes', 
    address: '45 Avenue de la Mer, Biarritz',
    pricePerNight: 250,
    capacity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1000',
    description: 'Grande villa moderne avec piscine chauffée, à 5 minutes de la plage.',
    amenities: ['Piscine', 'Climatisation', 'Vue Mer', 'BBQ']
  },
  { 
    id: 'p3', 
    name: 'Mas Provençal Authentique', 
    address: 'Chemin des Oliviers, Gordes',
    pricePerNight: 180,
    capacity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000',
    description: 'Vivez la Provence dans ce mas rénové avec goût. Calme absolu garanti.',
    amenities: ['Wifi', 'Cheminée', 'Grand Terrain', 'Animaux acceptés']
  },
];

export const RESERVATIONS: Reservation[] = [
  { id: 'r1', propertyId: 'p1', guestName: 'Marie Dupont', checkIn: new Date(new Date().setDate(new Date().getDate() - 2)), checkOut: new Date(new Date().setDate(new Date().getDate() + 2)), status: 'confirmed', source: 'airbnb', totalPrice: 480 },
  { id: 'r2', propertyId: 'p2', guestName: 'Jean Martin', checkIn: new Date(new Date().setDate(new Date().getDate() + 1)), checkOut: new Date(new Date().setDate(new Date().getDate() + 5)), status: 'confirmed', source: 'booking', totalPrice: 1000 },
  { id: 'r3', propertyId: 'p1', guestName: 'Travaux Peinture', checkIn: new Date(new Date().setDate(new Date().getDate() + 10)), checkOut: new Date(new Date().setDate(new Date().getDate() + 12)), status: 'blocked', source: 'direct', totalPrice: 0 },
  { id: 'r4', propertyId: 'p3', guestName: 'Nettoyage Printemps', checkIn: new Date(), checkOut: new Date(), status: 'cleaning', source: 'direct', totalPrice: 0 },
  { id: 'r5', propertyId: 'p1', guestName: 'Paul Smith', checkIn: new Date(new Date().setDate(new Date().getDate() + 15)), checkOut: new Date(new Date().setDate(new Date().getDate() + 20)), status: 'confirmed', source: 'airbnb', totalPrice: 600 },
];

export const CHANNELS: Channel[] = [
    { id: 'c1', name: 'Airbnb - Cottage', platform: 'airbnb', propertyId: 'p1', icalUrlImport: 'https://airbnb.com/calendar/ical/123...', icalUrlExport: 'https://gitemaster.app/ical/p1', lastSync: new Date(), status: 'active' },
    { id: 'c2', name: 'Booking - Cottage', platform: 'booking', propertyId: 'p1', icalUrlImport: '', icalUrlExport: 'https://gitemaster.app/ical/p1', lastSync: new Date(new Date().setHours(new Date().getHours() - 2)), status: 'error' },
    { id: 'c3', name: 'Airbnb - Villa', platform: 'airbnb', propertyId: 'p2', icalUrlImport: 'https://airbnb.com/calendar/ical/456...', icalUrlExport: 'https://gitemaster.app/ical/p2', lastSync: new Date(), status: 'active' },
];

export const INVENTORY: InventoryItem[] = [
  { id: 'i1', propertyId: 'p1', name: 'Papier Toilette', quantity: 2, threshold: 4, unit: 'rouleaux' },
  { id: 'i2', propertyId: 'p1', name: 'Savon Liquide', quantity: 500, threshold: 100, unit: 'ml' },
  { id: 'i3', propertyId: 'p2', name: 'Capsules Café', quantity: 5, threshold: 10, unit: 'capsules' },
  { id: 'i4', propertyId: 'p2', name: 'Éponges', quantity: 3, threshold: 2, unit: 'pièces' },
];

export const TICKETS: MaintenanceTicket[] = [
  { id: 't1', propertyId: 'p1', title: 'Fuite Robinet', description: 'Le robinet de la cuisine goutte.', status: 'new', priority: 'medium', createdAt: new Date() },
  { id: 't2', propertyId: 'p2', title: 'Wifi Instable', description: 'Le routeur redémarre souvent.', status: 'in_progress', priority: 'low', createdAt: new Date() },
];

export const CONVERSATIONS: Conversation[] = [
    {
        id: 'cv1',
        reservationId: 'r1',
        guestName: 'Marie Dupont',
        source: 'airbnb',
        lastMessage: 'Merci, à quelle heure pouvons-nous arriver ?',
        lastMessageDate: new Date(new Date().setHours(new Date().getHours() - 1)),
        unreadCount: 1,
        propertyId: 'p1'
    },
    {
        id: 'cv2',
        reservationId: 'r5',
        guestName: 'Paul Smith',
        source: 'booking',
        lastMessage: 'Is there a parking spot included?',
        lastMessageDate: new Date(new Date().setDate(new Date().getDate() - 1)),
        unreadCount: 0,
        propertyId: 'p1'
    }
];

export const MESSAGES: Message[] = [
    { id: 'm1', conversationId: 'cv1', sender: 'system', content: 'Réservation confirmée pour 4 nuits.', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), read: true },
    { id: 'm2', conversationId: 'cv1', sender: 'host', content: 'Bonjour Marie, merci pour votre réservation !', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), read: true },
    { id: 'm3', conversationId: 'cv1', sender: 'guest', content: 'Merci, à quelle heure pouvons-nous arriver ?', timestamp: new Date(new Date().setHours(new Date().getHours() - 1)), read: false },
];

export const TEMPLATES: MessageTemplate[] = [
    {
        id: 'tpl1',
        title: 'Confirmation & Merci',
        trigger: 'booking_confirmed',
        daysOffset: 0,
        content: "Bonjour {{guest_name}},\n\nMerci pour votre réservation à {{property_name}} ! Nous sommes ravis de vous accueillir du {{check_in}} au {{check_out}}.\n\nCordialement,",
        isActive: true
    },
    {
        id: 'tpl2',
        title: 'Instructions Arrivée (J-2)',
        trigger: 'before_checkin',
        daysOffset: -2,
        content: "Bonjour {{guest_name}},\n\nVotre arrivée approche ! Voici comment accéder au logement :\n1. Code portail : 1234\n2. Boîte à clé : 5678\n\nÀ bientôt !",
        isActive: true
    },
    {
        id: 'tpl3',
        title: 'Demande d\'avis (J+1)',
        trigger: 'after_checkout',
        daysOffset: 1,
        content: "Bonjour {{guest_name}},\n\nJ'espère que vous avez fait bon voyage de retour. Si vous avez apprécié votre séjour, n'hésitez pas à nous laisser un commentaire 5 étoiles !\n\nMerci encore.",
        isActive: false
    }
];

export const EXPENSES: Expense[] = [
    { id: 'e1', propertyId: 'p1', category: 'maintenance', description: 'Plombier (Fuite)', amount: 150, date: new Date(new Date().setDate(new Date().getDate() - 5)) },
    { id: 'e2', propertyId: 'p1', category: 'utilities', description: 'Facture Électricité EDF', amount: 85.50, date: new Date(new Date().setDate(new Date().getDate() - 10)) },
    { id: 'e3', propertyId: 'p2', category: 'supplies', description: 'Achat Papier Toilette & Savon', amount: 45, date: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { id: 'e4', propertyId: 'p1', category: 'tax', description: 'Taxe de séjour (Mois dernier)', amount: 32, date: new Date(new Date().setDate(new Date().getDate() - 20)) },
];
