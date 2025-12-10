/**
 * SupabaseService - Gestion base de données cloud
 * 
 * Features:
 * - CRUD complet
 * - Sync temps réel
 * - Auth utilisateurs
 * - Storage fichiers
 * 
 * Setup: https://supabase.com
 * Plan gratuit: 500MB + 2GB bandwidth/mois
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient | null = null;
  private isConfigured: boolean = false;

  private constructor() {
    this.loadConfig();
  }

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // ========== CONFIGURATION ==========

  private loadConfig(): void {
    const url = localStorage.getItem('supabase_url');
    const anonKey = localStorage.getItem('supabase_anon_key');

    if (url && anonKey) {
      this.configure({ url, anonKey });
    } else {
      console.warn('⚠️ Supabase: Non configuré. Mode localStorage actif.');
    }
  }

  configure(config: SupabaseConfig): boolean {
    try {
      this.client = createClient(config.url, config.anonKey);
      this.isConfigured = true;
      
      // Sauvegarder config
      localStorage.setItem('supabase_url', config.url);
      localStorage.setItem('supabase_anon_key', config.anonKey);
      
      console.log('✅ Supabase: Configuré et connecté');
      return true;
    } catch (error) {
      console.error('❌ Supabase: Erreur configuration', error);
      this.isConfigured = false;
      return false;
    }
  }

  isReady(): boolean {
    return this.isConfigured && this.client !== null;
  }

  getClient(): SupabaseClient | null {
    return this.client;
  }

  // ========== BOOKINGS ==========

  async saveBooking(booking: any): Promise<{ success: boolean; error?: string }> {
    if (!this.isReady()) {
      return { success: false, error: 'Supabase non configuré' };
    }

    try {
      const { data, error } = await this.client!
        .from('bookings')
        .upsert(booking, { onConflict: 'id' })
        .select();

      if (error) throw error;
      
      console.log('💾 Supabase: Booking sauvegardé', booking.id);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Supabase: Erreur save booking', error);
      return { success: false, error: error.message };
    }
  }

  async getBookings(): Promise<{ data: any[] | null; error?: string }> {
    if (!this.isReady()) {
      return { data: null, error: 'Supabase non configuré' };
    }

    try {
      const { data, error } = await this.client!
        .from('bookings')
        .select('*')
        .order('checkIn', { ascending: false });

      if (error) throw error;
      
      console.log(`📂 Supabase: ${data?.length || 0} bookings chargés`);
      return { data };
    } catch (error: any) {
      console.error('❌ Supabase: Erreur get bookings', error);
      return { data: null, error: error.message };
    }
  }

  async deleteBooking(id: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isReady()) {
      return { success: false, error: 'Supabase non configuré' };
    }

    try {
      const { error } = await this.client!
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      console.log('🗑️ Supabase: Booking supprimé', id);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Supabase: Erreur delete booking', error);
      return { success: false, error: error.message };
    }
  }

  // ========== PROPERTIES ==========

  async saveProperty(property: any): Promise<{ success: boolean; error?: string }> {
    if (!this.isReady()) {
      return { success: false, error: 'Supabase non configuré' };
    }

    try {
      const { data, error } = await this.client!
        .from('properties')
        .upsert(property, { onConflict: 'id' })
        .select();

      if (error) throw error;
      
      console.log('💾 Supabase: Property sauvegardée', property.id);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Supabase: Erreur save property', error);
      return { success: false, error: error.message };
    }
  }

  async getProperties(): Promise<{ data: any[] | null; error?: string }> {
    if (!this.isReady()) {
      return { data: null, error: 'Supabase non configuré' };
    }

    try {
      const { data, error } = await this.client!
        .from('properties')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      
      console.log(`📂 Supabase: ${data?.length || 0} properties chargées`);
      return { data };
    } catch (error: any) {
      console.error('❌ Supabase: Erreur get properties', error);
      return { data: null, error: error.message };
    }
  }

  // ========== CLEANING TASKS ==========

  async saveCleaningTask(task: any): Promise<{ success: boolean; error?: string }> {
    if (!this.isReady()) {
      return { success: false, error: 'Supabase non configuré' };
    }

    try {
      const { data, error } = await this.client!
        .from('cleaning_tasks')
        .upsert(task, { onConflict: 'id' })
        .select();

      if (error) throw error;
      
      console.log('💾 Supabase: Cleaning task sauvegardée', task.id);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Supabase: Erreur save task', error);
      return { success: false, error: error.message };
    }
  }

  async getCleaningTasks(): Promise<{ data: any[] | null; error?: string }> {
    if (!this.isReady()) {
      return { data: null, error: 'Supabase non configuré' };
    }

    try {
      const { data, error } = await this.client!
        .from('cleaning_tasks')
        .select('*')
        .order('scheduledDate', { ascending: true });

      if (error) throw error;
      
      console.log(`📂 Supabase: ${data?.length || 0} tasks chargées`);
      return { data };
    } catch (error: any) {
      console.error('❌ Supabase: Erreur get tasks', error);
      return { data: null, error: error.message };
    }
  }

  // ========== SYNC TEMPS RÉEL ==========

  subscribeToBookings(callback: (payload: any) => void) {
    if (!this.isReady()) {
      console.warn('⚠️ Supabase: Cannot subscribe, not configured');
      return null;
    }

    const subscription = this.client!
      .channel('bookings-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        callback
      )
      .subscribe();

    console.log('🔄 Supabase: Subscribed to bookings changes');
    return subscription;
  }

  // ========== STORAGE (Photos) ==========

  async uploadPhoto(file: File, bucket: string = 'property-photos'): Promise<{ url: string | null; error?: string }> {
    if (!this.isReady()) {
      return { url: null, error: 'Supabase non configuré' };
    }

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await this.client!.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = this.client!.storage
        .from(bucket)
        .getPublicUrl(fileName);

      console.log('📸 Supabase: Photo uploadée', fileName);
      return { url: publicUrl };
    } catch (error: any) {
      console.error('❌ Supabase: Erreur upload photo', error);
      return { url: null, error: error.message };
    }
  }

  // ========== MIGRATION ==========

  async migrateFromLocalStorage(): Promise<{ success: boolean; migrated: number; error?: string }> {
    if (!this.isReady()) {
      return { success: false, migrated: 0, error: 'Supabase non configuré' };
    }

    console.log('🔄 Supabase: Migration depuis localStorage...');
    let migrated = 0;

    try {
      // Migrer bookings
      const bookingsStr = localStorage.getItem('gitemaster_bookings');
      if (bookingsStr) {
        const bookings = JSON.parse(bookingsStr);
        for (const booking of bookings) {
          const result = await this.saveBooking(booking);
          if (result.success) migrated++;
        }
        console.log(`✅ Migré ${bookings.length} bookings`);
      }

      // Migrer properties
      const propertiesStr = localStorage.getItem('gitemaster_properties');
      if (propertiesStr) {
        const properties = JSON.parse(propertiesStr);
        for (const property of properties) {
          const result = await this.saveProperty(property);
          if (result.success) migrated++;
        }
        console.log(`✅ Migré ${properties.length} properties`);
      }

      // Migrer cleaning tasks
      const tasksStr = localStorage.getItem('gitemaster_cleaning_tasks');
      if (tasksStr) {
        const tasks = JSON.parse(tasksStr);
        for (const task of tasks) {
          const result = await this.saveCleaningTask(task);
          if (result.success) migrated++;
        }
        console.log(`✅ Migré ${tasks.length} tasks`);
      }

      console.log(`✅ Supabase: Migration terminée (${migrated} items)`);
      return { success: true, migrated };
    } catch (error: any) {
      console.error('❌ Supabase: Erreur migration', error);
      return { success: false, migrated, error: error.message };
    }
  }

  // ========== TEST CONNECTION ==========

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.isReady()) {
      return { success: false, message: 'Supabase non configuré' };
    }

    try {
      const { data, error } = await this.client!
        .from('properties')
        .select('count')
        .limit(1);

      if (error) throw error;

      return { success: true, message: 'Connexion réussie ✅' };
    } catch (error: any) {
      return { success: false, message: `Erreur: ${error.message}` };
    }
  }
}

// Export singleton
const supabaseService = SupabaseService.getInstance();
export default supabaseService;
