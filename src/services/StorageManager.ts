/**
 * StorageManager - Gestion robuste de la persistence
 * 
 * Features:
 * - Double sauvegarde (localStorage + backup)
 * - Vérification intégrité
 * - Auto-restore si corruption
 * - Export/Import données
 */

class StorageManager {
  private static instance: StorageManager;
  private readonly KEYS = {
    BOOKINGS: 'gitemaster_bookings',
    CLEANING_TASKS: 'gitemaster_cleaning_tasks',
    PROPERTIES: 'gitemaster_properties',
    SETTINGS: 'gitemaster_settings',
    WELCOME_GUIDE: 'gitemaster_welcome_guide',
    CLEANING_REPORTS: 'gitemaster_cleaning_reports',
    // Backups
    BOOKINGS_BACKUP: 'gitemaster_bookings_backup',
    CLEANING_TASKS_BACKUP: 'gitemaster_cleaning_tasks_backup',
    PROPERTIES_BACKUP: 'gitemaster_properties_backup',
    // Meta
    LAST_BACKUP: 'gitemaster_last_backup',
    DATA_VERSION: 'gitemaster_data_version'
  };

  private readonly CURRENT_VERSION = '2.0.0';

  private constructor() {
    this.initialize();
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private initialize(): void {
    console.log('🔧 StorageManager: Initializing...');
    
    // Vérifier version
    const version = localStorage.getItem(this.KEYS.DATA_VERSION);
    if (!version) {
      console.log('📝 StorageManager: First run, setting version');
      localStorage.setItem(this.KEYS.DATA_VERSION, this.CURRENT_VERSION);
    }

    // Auto-backup toutes les 5 minutes
    setInterval(() => this.autoBackup(), 5 * 60 * 1000);

    console.log('✅ StorageManager: Initialized');
  }

  // ========== SAVE ==========

  save(key: string, data: any): boolean {
    try {
      const jsonData = JSON.stringify(data);
      
      // Sauvegarde principale
      localStorage.setItem(key, jsonData);
      
      // Sauvegarde backup
      const backupKey = `${key}_backup`;
      if (this.KEYS[backupKey.toUpperCase().replace('GITEMASTER_', '')]) {
        localStorage.setItem(backupKey, jsonData);
      }
      
      console.log(`💾 StorageManager: Saved ${key} (${jsonData.length} bytes)`);
      return true;
    } catch (error) {
      console.error(`❌ StorageManager: Failed to save ${key}`, error);
      return false;
    }
  }

  // ========== LOAD ==========

  load<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      
      if (data) {
        const parsed = JSON.parse(data);
        console.log(`📂 StorageManager: Loaded ${key} (${data.length} bytes)`);
        return parsed;
      }

      // Essayer backup si principale vide
      const backupKey = `${key}_backup`;
      const backupData = localStorage.getItem(backupKey);
      
      if (backupData) {
        console.warn(`⚠️ StorageManager: Main data empty, restoring from backup for ${key}`);
        const parsed = JSON.parse(backupData);
        // Restaurer dans principale
        localStorage.setItem(key, backupData);
        return parsed;
      }

      console.log(`ℹ️ StorageManager: No data for ${key}, using default`);
      return defaultValue;
    } catch (error) {
      console.error(`❌ StorageManager: Failed to load ${key}, trying backup`, error);
      
      // Essayer backup en cas d'erreur
      try {
        const backupKey = `${key}_backup`;
        const backupData = localStorage.getItem(backupKey);
        if (backupData) {
          const parsed = JSON.parse(backupData);
          console.log(`✅ StorageManager: Restored from backup for ${key}`);
          // Restaurer dans principale
          localStorage.setItem(key, backupData);
          return parsed;
        }
      } catch (backupError) {
        console.error(`❌ StorageManager: Backup also failed for ${key}`);
      }

      return defaultValue;
    }
  }

  // ========== BOOKINGS ==========

  saveBookings(bookings: any[]): boolean {
    return this.save(this.KEYS.BOOKINGS, bookings);
  }

  loadBookings(): any[] {
    return this.load(this.KEYS.BOOKINGS, []);
  }

  // ========== CLEANING TASKS ==========

  saveCleaningTasks(tasks: any[]): boolean {
    return this.save(this.KEYS.CLEANING_TASKS, tasks);
  }

  loadCleaningTasks(): any[] {
    return this.load(this.KEYS.CLEANING_TASKS, []);
  }

  // ========== PROPERTIES ==========

  saveProperties(properties: any[]): boolean {
    return this.save(this.KEYS.PROPERTIES, properties);
  }

  loadProperties(): any[] {
    return this.load(this.KEYS.PROPERTIES, []);
  }

  // ========== AUTO BACKUP ==========

  autoBackup(): void {
    console.log('🔄 StorageManager: Auto-backup starting...');
    
    const dataToBackup = [
      { key: this.KEYS.BOOKINGS, backupKey: this.KEYS.BOOKINGS_BACKUP },
      { key: this.KEYS.CLEANING_TASKS, backupKey: this.KEYS.CLEANING_TASKS_BACKUP },
      { key: this.KEYS.PROPERTIES, backupKey: this.KEYS.PROPERTIES_BACKUP }
    ];

    let backedUp = 0;
    dataToBackup.forEach(({ key, backupKey }) => {
      const data = localStorage.getItem(key);
      if (data) {
        localStorage.setItem(backupKey, data);
        backedUp++;
      }
    });

    localStorage.setItem(this.KEYS.LAST_BACKUP, new Date().toISOString());
    console.log(`✅ StorageManager: Auto-backup completed (${backedUp} items)`);
  }

  // ========== EXPORT / IMPORT ==========

  exportAllData(): string {
    const exportData = {
      version: this.CURRENT_VERSION,
      timestamp: new Date().toISOString(),
      bookings: this.loadBookings(),
      cleaningTasks: this.loadCleaningTasks(),
      properties: this.loadProperties(),
      settings: localStorage.getItem(this.KEYS.SETTINGS),
      welcomeGuide: localStorage.getItem(this.KEYS.WELCOME_GUIDE)
    };

    return JSON.stringify(exportData, null, 2);
  }

  importAllData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      
      console.log('📥 StorageManager: Importing data...');

      if (data.bookings) {
        this.saveBookings(data.bookings);
      }
      if (data.cleaningTasks) {
        this.saveCleaningTasks(data.cleaningTasks);
      }
      if (data.properties) {
        this.saveProperties(data.properties);
      }
      if (data.settings) {
        localStorage.setItem(this.KEYS.SETTINGS, data.settings);
      }
      if (data.welcomeGuide) {
        localStorage.setItem(this.KEYS.WELCOME_GUIDE, data.welcomeGuide);
      }

      console.log('✅ StorageManager: Import successful');
      return true;
    } catch (error) {
      console.error('❌ StorageManager: Import failed', error);
      return false;
    }
  }

  // ========== DIAGNOSTICS ==========

  getStorageInfo(): {
    used: number;
    available: number;
    percentUsed: number;
    items: { key: string; size: number }[];
  } {
    let totalSize = 0;
    const items: { key: string; size: number }[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('gitemaster_')) {
        const value = localStorage.getItem(key) || '';
        const size = new Blob([value]).size;
        totalSize += size;
        items.push({ key, size });
      }
    }

    // LocalStorage limite: ~5-10MB selon navigateur
    const available = 10 * 1024 * 1024; // 10MB
    const percentUsed = (totalSize / available) * 100;

    return {
      used: totalSize,
      available,
      percentUsed,
      items: items.sort((a, b) => b.size - a.size)
    };
  }

  printDiagnostics(): void {
    console.log('📊 StorageManager Diagnostics:');
    console.log('================================');
    
    const info = this.getStorageInfo();
    console.log(`Used: ${(info.used / 1024).toFixed(2)} KB`);
    console.log(`Available: ${(info.available / 1024).toFixed(2)} KB`);
    console.log(`Percent Used: ${info.percentUsed.toFixed(2)}%`);
    console.log('\nTop Items:');
    info.items.slice(0, 10).forEach(item => {
      console.log(`  ${item.key}: ${(item.size / 1024).toFixed(2)} KB`);
    });

    const lastBackup = localStorage.getItem(this.KEYS.LAST_BACKUP);
    console.log(`\nLast Backup: ${lastBackup || 'Never'}`);
    console.log(`Version: ${this.CURRENT_VERSION}`);
    console.log('================================');
  }

  // ========== CLEAR ==========

  clearAllData(): void {
    if (confirm('⚠️ Êtes-vous sûr de vouloir effacer TOUTES les données ? Cette action est irréversible.')) {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('🗑️ StorageManager: All data cleared');
      alert('✅ Toutes les données ont été effacées');
      window.location.reload();
    }
  }
}

// Export singleton
const storageManager = StorageManager.getInstance();
export default storageManager;
