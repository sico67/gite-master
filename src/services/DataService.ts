// Service centralisé de gestion des données
// Gère localStorage + interactions entre modules

import StorageManager from './StorageManager';

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

interface CleaningTask {
  id: string;
  bookingId: string;
  guestName: string;
  propertyName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  assignedTo?: string;
  assignedPhone?: string;
  cost: number;
  checklist: ChecklistItem[];
  notes?: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

class DataService {
  private static instance: DataService;

  private constructor() {}

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // ========== BOOKINGS ==========

  getBookings(): Booking[] {
    return StorageManager.loadBookings();
  }

  saveBookings(bookings: Booking[]): void {
    StorageManager.saveBookings(bookings);
  }

  addBooking(booking: Booking, createCleaningTask: boolean = true): void {
    const bookings = this.getBookings();
    bookings.push(booking);
    this.saveBookings(bookings);

    // Auto-créer tâche ménage si demandé
    if (createCleaningTask && booking.status === 'confirmed') {
      this.autoCreateCleaningTask(booking);
    }
  }

  updateBooking(id: string, updates: Partial<Booking>): void {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      this.saveBookings(bookings);
    }
  }

  deleteBooking(id: string): void {
    const bookings = this.getBookings().filter(b => b.id !== id);
    this.saveBookings(bookings);
    
    // Supprimer aussi la tâche ménage associée
    const tasks = this.getCleaningTasks().filter(t => t.bookingId !== id);
    this.saveCleaningTasks(tasks);
  }

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find(b => b.id === id);
  }

  // ========== CLEANING TASKS ==========

  getCleaningTasks(): CleaningTask[] {
    return StorageManager.loadCleaningTasks();
  }

  saveCleaningTasks(tasks: CleaningTask[]): void {
    StorageManager.saveCleaningTasks(tasks);
  }

  addCleaningTask(task: CleaningTask): void {
    const tasks = this.getCleaningTasks();
    tasks.push(task);
    this.saveCleaningTasks(tasks);
  }

  updateCleaningTask(id: string, updates: Partial<CleaningTask>): void {
    const tasks = this.getCleaningTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.saveCleaningTasks(tasks);
    }
  }

  // Auto-créer tâche ménage après réservation
  private autoCreateCleaningTask(booking: Booking): void {
    const checkOutDate = new Date(booking.checkOut);
    checkOutDate.setHours(14, 0, 0, 0); // 2h après checkout (11h + 2h = 14h)
    
    const DEFAULT_CHECKLIST: ChecklistItem[] = [
      { id: '1', task: 'Changer les draps', completed: false },
      { id: '2', task: 'Aspirer et laver le sol', completed: false },
      { id: '3', task: 'Nettoyer salle de bain', completed: false },
      { id: '4', task: 'Nettoyer cuisine', completed: false },
      { id: '5', task: 'Vider poubelles', completed: false },
      { id: '6', task: 'Vérifier stocks (PQ, savon)', completed: false },
    ];

    const cleaningTask: CleaningTask = {
      id: `clean_${Date.now()}`,
      bookingId: booking.id,
      guestName: booking.guestName,
      propertyName: booking.propertyName,
      scheduledDate: checkOutDate.toISOString().split('T')[0],
      scheduledTime: '14:00',
      status: 'pending',
      cost: 80,
      checklist: DEFAULT_CHECKLIST,
      notes: `Ménage après le départ de ${booking.guestName}`
    };

    this.addCleaningTask(cleaningTask);
  }

  // ========== MESSAGES ==========

  getMessages(): any[] {
    const data = localStorage.getItem('gitemaster_messages');
    return data ? JSON.parse(data) : [];
  }

  saveMessages(messages: any[]): void {
    localStorage.setItem('gitemaster_messages', JSON.stringify(messages));
  }

  addMessage(message: any): void {
    const messages = this.getMessages();
    messages.push(message);
    this.saveMessages(messages);
  }

  // ========== TRANSACTIONS ==========

  getTransactions(): any[] {
    const data = localStorage.getItem('gitemaster_transactions');
    return data ? JSON.parse(data) : [];
  }

  saveTransactions(transactions: any[]): void {
    localStorage.setItem('gitemaster_transactions', JSON.stringify(transactions));
  }

  addTransaction(transaction: any): void {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    this.saveTransactions(transactions);
  }

  // ========== TOURIST TAX ==========

  getTouristTaxes(): any[] {
    const data = localStorage.getItem('gitemaster_tourist_tax');
    return data ? JSON.parse(data) : [];
  }

  saveTouristTaxes(taxes: any[]): void {
    localStorage.setItem('gitemaster_tourist_tax', JSON.stringify(taxes));
  }

  addTouristTax(tax: any): void {
    const taxes = this.getTouristTaxes();
    taxes.push(tax);
    this.saveTouristTaxes(taxes);
  }

  // ========== REVIEW LINKS ==========

  getReviewLinks(): { google: string; airbnb: string; booking: string } {
    const data = localStorage.getItem('gitemaster_review_links');
    if (data) return JSON.parse(data);
    
    // Valeurs par défaut
    return {
      google: '',
      airbnb: '',
      booking: ''
    };
  }

  saveReviewLinks(links: { google: string; airbnb: string; booking: string }): void {
    localStorage.setItem('gitemaster_review_links', JSON.stringify(links));
  }

  // ========== STATISTICS ==========

  getBookingStats() {
    const bookings = this.getBookings();
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const thisMonthBookings = bookings.filter(b => {
      const date = new Date(b.checkIn);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const totalRevenue = thisMonthBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      totalBookings: bookings.length,
      thisMonthBookings: thisMonthBookings.length,
      totalRevenue,
      confirmedBookings: bookings.filter(b => b.status === 'confirmed').length
    };
  }

  // ========== EXPORT ==========

  exportData(): string {
    return JSON.stringify({
      bookings: this.getBookings(),
      cleaning: this.getCleaningTasks(),
      messages: this.getMessages(),
      transactions: this.getTransactions(),
      touristTax: this.getTouristTaxes(),
      reviewLinks: this.getReviewLinks(),
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  // ========== IMPORT ==========

  importData(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString);
      if (data.bookings) this.saveBookings(data.bookings);
      if (data.cleaning) this.saveCleaningTasks(data.cleaning);
      if (data.messages) this.saveMessages(data.messages);
      if (data.transactions) this.saveTransactions(data.transactions);
      if (data.touristTax) this.saveTouristTaxes(data.touristTax);
      if (data.reviewLinks) this.saveReviewLinks(data.reviewLinks);
    } catch (error) {
      console.error('Import failed:', error);
      throw new Error('Import échoué : format de données invalide');
    }
  }
}

export default DataService.getInstance();
