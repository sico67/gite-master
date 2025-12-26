// Service de gestion des propriétés
// Support multi-propriétés avec toutes les infos nécessaires

export interface Property {
  id: string;
  name: string;
  type: 'villa' | 'appartement' | 'gite' | 'chambre' | 'studio';
  
  // Localisation
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  
  // Capacité
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  
  // Tarification
  pricing: {
    basePrice: number;
    weekendPrice?: number;
    cleaningFee: number;
    deposit: number;
    minStay: number;
  };
  
  // Médias
  photos: string[];
  coverPhoto?: string;
  
  // Description
  description: {
    short: string;
    long: string;
  };
  
  // Équipements
  amenities: string[];
  
  // Accès
  access: {
    checkInTime: string;
    checkOutTime: string;
    gateCode?: string;
    keyBoxCode?: string;
    instructions?: string;
  };
  
  // WiFi
  wifi: {
    ssid: string;
    password: string;
  };
  
  // Règles
  rules: string[];
  
  // Contact
  contact: {
    phone: string;
    email: string;
    emergency?: string;
  };
  
  // Statut
  isActive: boolean;
  isPublished: boolean;
  
  // Métadonnées
  createdAt: string;
  updatedAt: string;
}

class PropertyService {
  private static instance: PropertyService;
  private properties: Property[] = [];

  private constructor() {
    this.loadProperties();
  }

  static getInstance(): PropertyService {
    if (!PropertyService.instance) {
      PropertyService.instance = new PropertyService();
    }
    return PropertyService.instance;
  }

  // ========== CRUD ==========

  loadProperties(): Property[] {
    const saved = localStorage.getItem('gitemaster_properties');
    if (saved) {
      this.properties = JSON.parse(saved);
    } else {
      // Propriété démo par défaut
      this.properties = [this.getDefaultProperty()];
      this.saveProperties();
    }
    return this.properties;
  }

  saveProperties(): void {
    localStorage.setItem('gitemaster_properties', JSON.stringify(this.properties));
  }

  getProperties(): Property[] {
    return this.properties;
  }

  getActiveProperties(): Property[] {
    return this.properties.filter(p => p.isActive);
  }

  getPublishedProperties(): Property[] {
    return this.properties.filter(p => p.isPublished && p.isActive);
  }

  getPropertyById(id: string): Property | undefined {
    return this.properties.find(p => p.id === id);
  }

  addProperty(property: Property): void {
    property.id = crypto.randomUUID();
    property.createdAt = new Date().toISOString();
    property.updatedAt = new Date().toISOString();
    this.properties.push(property);
    this.saveProperties();
  }

  updateProperty(id: string, updates: Partial<Property>): void {
    const index = this.properties.findIndex(p => p.id === id);
    if (index !== -1) {
      this.properties[index] = {
        ...this.properties[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveProperties();
    }
  }

  deleteProperty(id: string): void {
    this.properties = this.properties.filter(p => p.id !== id);
    this.saveProperties();
  }

  // ========== UTILITAIRES ==========

  getDefaultProperty(): Property {
    return {
      id: 'p1',
      name: 'Villa Exemple',
      type: 'villa',
      address: {
        street: '123 Rue de la Paix',
        city: 'Nice',
        zipCode: '06000',
        country: 'France'
      },
      capacity: {
        guests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 2
      },
      pricing: {
        basePrice: 140,
        weekendPrice: 160,
        cleaningFee: 80,
        deposit: 500,
        minStay: 2
      },
      photos: [
        'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
      ],
      coverPhoto: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800',
      description: {
        short: 'Villa spacieuse avec piscine et vue mer',
        long: 'Magnifique villa de 150m² pouvant accueillir jusqu\'à 6 personnes. Profitez d\'une piscine privée, d\'une vue imprenable sur la mer et de tout le confort moderne.'
      },
      amenities: [
        'WiFi',
        'Piscine privée',
        'Parking gratuit',
        'Climatisation',
        'Cuisine équipée',
        'Machine à laver',
        'Lave-vaisselle',
        'TV',
        'Barbecue',
        'Terrasse'
      ],
      access: {
        checkInTime: '16:00',
        checkOutTime: '11:00',
        gateCode: '1234A',
        keyBoxCode: '5678',
        instructions: 'La boîte à clés se trouve à gauche de la porte d\'entrée.'
      },
      wifi: {
        ssid: 'Villa_WiFi',
        password: 'welcome2024'
      },
      rules: [
        'Non fumeur',
        'Pas d\'animaux',
        'Pas de fêtes',
        'Respecter le voisinage (silence après 22h)'
      ],
      contact: {
        phone: '+33 6 12 34 56 78',
        email: 'contact@votrevilla.com',
        emergency: '+33 6 98 76 54 32'
      },
      isActive: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Créer template vide pour nouvelle propriété
  createEmptyProperty(): Partial<Property> {
    return {
      name: '',
      type: 'appartement',
      address: {
        street: '',
        city: '',
        zipCode: '',
        country: 'France'
      },
      capacity: {
        guests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1
      },
      pricing: {
        basePrice: 100,
        cleaningFee: 50,
        deposit: 300,
        minStay: 2
      },
      photos: [],
      description: {
        short: '',
        long: ''
      },
      amenities: [],
      access: {
        checkInTime: '16:00',
        checkOutTime: '11:00'
      },
      wifi: {
        ssid: '',
        password: ''
      },
      rules: [],
      contact: {
        phone: '',
        email: ''
      },
      isActive: true,
      isPublished: false
    };
  }

  // Stats par propriété
  getPropertyStats(propertyId: string) {
    // À implémenter avec DataService
    return {
      totalBookings: 0,
      totalRevenue: 0,
      occupancyRate: 0,
      avgRating: 0
    };
  }

  // Dupliquer propriété
  duplicateProperty(id: string): Property | null {
    const property = this.getPropertyById(id);
    if (!property) return null;

    const duplicate: Property = {
      ...property,
      id: crypto.randomUUID(),
      name: `${property.name} (Copie)`,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.properties.push(duplicate);
    this.saveProperties();
    return duplicate;
  }

  // Export/Import
  exportProperty(id: string): string {
    const property = this.getPropertyById(id);
    return property ? JSON.stringify(property, null, 2) : '';
  }

  importProperty(jsonString: string): boolean {
    try {
      const property = JSON.parse(jsonString) as Property;
      property.id = crypto.randomUUID();
      property.createdAt = new Date().toISOString();
      property.updatedAt = new Date().toISOString();
      this.properties.push(property);
      this.saveProperties();
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }
}

export default PropertyService.getInstance();
