export interface AppSettings {
  general: {
    appName: string;
    primaryColor: 'blue' | 'green' | 'purple' | 'red' | 'indigo' | 'teal';
    logo?: string;
    email: string;
    phone: string;
    address: string;
  };
  properties: Property[];
  pricing: {
    defaultRate: number;
    cleaningFee: number;
    deposit: number;
    minimumStay: number;
  };
}

interface Property {
  id: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  bedrooms: number;
  price: number;
  city: string;
}

class ConfigService {
  private static instance: ConfigService;
  private settings: AppSettings | null = null;

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  async loadSettings(): Promise<AppSettings> {
    if (this.settings) return this.settings;

    try {
      const stored = localStorage.getItem('gitemaster_settings');
      if (stored) {
        this.settings = JSON.parse(stored);
      } else {
        this.settings = this.getDefaultSettings();
        await this.saveSettings(this.settings);
      }
    } catch (error) {
      this.settings = this.getDefaultSettings();
    }
    return this.settings;
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    this.settings = settings;
    localStorage.setItem('gitemaster_settings', JSON.stringify(settings));
  }

  getSettings(): AppSettings {
    return this.settings || this.getDefaultSettings();
  }

  private getDefaultSettings(): AppSettings {
    return {
      general: {
        appName: 'Gîte Master',
        primaryColor: 'blue',
        email: 'contact@gitemaster.com',
        phone: '+33 6 12 34 56 78',
        address: '123 Rue Example, 75001 Paris',
      },
      properties: [
        {
          id: 'p1',
          name: 'Villa Exemple',
          description: 'Belle villa moderne',
          type: 'villa',
          capacity: 6,
          bedrooms: 3,
          price: 150,
          city: 'Nice',
        },
      ],
      pricing: {
        defaultRate: 100,
        cleaningFee: 50,
        deposit: 300,
        minimumStay: 2,
      },
    };
  }
}

export default ConfigService.getInstance();
