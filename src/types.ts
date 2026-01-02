
export enum UserRole {
  OWNER = 'owner',
  CLEANER = 'cleaner',
}

export interface Property {
  id: string;
  name: string;
  address: string;
  // Nouveaux champs pour le Site Vitrine
  pricePerNight: number;
  capacity: number;
  description: string;
  imageUrl: string;
  amenities: string[];
  // Taxe de séjour
  touristTaxRate?: number; // En euros par personne et par nuit
  touristTaxCity?: string; // Pour récupérer le taux automatique
}

export type ReservationSource = 'direct' | 'airbnb' | 'booking' | 'vrbo';

export interface Reservation {
  id: string;
  propertyId: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'blocked' | 'cleaning';
  source: ReservationSource;
  guestCount?: number;
  totalPrice?: number;
  // Taxe de séjour
  touristTaxAmount?: number;
  touristTaxPaid?: boolean;
  // Contact
  guestEmail?: string;
  guestPhone?: string;
}

export interface Channel {
  id: string;
  name: string;
  platform: 'airbnb' | 'booking' | 'vrbo' | 'other';
  propertyId: string;
  icalUrlImport?: string;
  icalUrlExport: string;
  lastSync: Date;
  status: 'active' | 'error' | 'disconnected';
}

export interface InventoryItem {
  id: string;
  propertyId: string;
  name: string;
  quantity: number;
  threshold: number;
  unit: string;
}

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  status: 'new' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  resolvedAt?: Date;
  cost?: number;
  imageUrl?: string;
}

export interface CleaningSession {
  id: string;
  reservationId: string;
  propertyId: string;
  cleanerName: string;
  status: 'pending' | 'completed';
  scheduledDate: Date;
  report?: {
    damages: string;
    lowStockItems: string[];
    completedAt: Date;
  };
}

// --- MESSAGERIE & AUTOMATISATION ---
export interface Message {
  id: string;
  conversationId: string;
  sender: 'host' | 'guest' | 'system';
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  reservationId: string;
  guestName: string;
  source: ReservationSource;
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: number;
  propertyId: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  trigger: 'booking_confirmed' | 'before_checkin' | 'after_checkout';
  daysOffset: number;
  content: string;
  isActive: boolean;
}

// --- FINANCE ---
export interface Expense {
  id: string;
  propertyId: string;
  category: 'maintenance' | 'supplies' | 'utilities' | 'tax' | 'other';
  description: string;
  amount: number;
  date: Date;
  receiptUrl?: string;
}
