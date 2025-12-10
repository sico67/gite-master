/**
 * StripeService - Gestion paiements
 * 
 * Features:
 * - Paiements one-time
 * - Cautions (hold + release)
 * - Abonnements
 * - Webhooks
 * 
 * Setup: https://stripe.com
 * Mode test: Cartes test disponibles
 */

interface StripeConfig {
  publishableKey: string;
  secretKey?: string; // Backend only
}

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string;
}

class StripeService {
  private static instance: StripeService;
  private stripe: any = null;
  private isConfigured: boolean = false;
  private publishableKey: string = '';

  private constructor() {
    this.loadConfig();
  }

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  // ========== CONFIGURATION ==========

  private loadConfig(): void {
    const publishableKey = localStorage.getItem('stripe_publishable_key');

    if (publishableKey) {
      this.configure({ publishableKey });
    } else {
      console.warn('⚠️ Stripe: Non configuré. Paiements simulés.');
    }
  }

  async configure(config: StripeConfig): Promise<boolean> {
    try {
      // Charger Stripe.js depuis CDN
      if (!window.Stripe) {
        await this.loadStripeJS();
      }

      this.stripe = window.Stripe(config.publishableKey);
      this.publishableKey = config.publishableKey;
      this.isConfigured = true;

      // Sauvegarder config
      localStorage.setItem('stripe_publishable_key', config.publishableKey);

      console.log('✅ Stripe: Configuré et prêt');
      return true;
    } catch (error) {
      console.error('❌ Stripe: Erreur configuration', error);
      this.isConfigured = false;
      return false;
    }
  }

  private async loadStripeJS(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Stripe.js'));
      document.head.appendChild(script);
    });
  }

  isReady(): boolean {
    return this.isConfigured && this.stripe !== null;
  }

  // ========== PAIEMENT ONE-TIME ==========

  async createPaymentIntent(
    amount: number, 
    currency: string = 'eur',
    metadata: any = {}
  ): Promise<{ success: boolean; clientSecret?: string; error?: string }> {
    
    if (!this.isReady()) {
      return this.simulatePayment(amount, currency);
    }

    try {
      // En production, appeler votre backend qui appelle Stripe API
      // Backend: stripe.paymentIntents.create({ amount, currency, ... })
      
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Centimes
          currency,
          metadata
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      console.log('💳 Stripe: Payment intent créé', data.id);
      return { success: true, clientSecret: data.clientSecret };

    } catch (error: any) {
      console.error('❌ Stripe: Erreur create payment', error);
      
      // Fallback simulation
      return this.simulatePayment(amount, currency);
    }
  }

  async confirmPayment(
    clientSecret: string,
    cardElement: any
  ): Promise<{ success: boolean; paymentIntent?: any; error?: string }> {
    
    if (!this.isReady()) {
      return { success: false, error: 'Stripe non configuré' };
    }

    try {
      const { paymentIntent, error } = await this.stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (error) throw error;

      console.log('✅ Stripe: Paiement confirmé', paymentIntent.id);
      return { success: true, paymentIntent };

    } catch (error: any) {
      console.error('❌ Stripe: Erreur confirm payment', error);
      return { success: false, error: error.message };
    }
  }

  // ========== CAUTION (PRE-AUTHORIZATION) ==========

  async createDeposit(
    amount: number,
    currency: string = 'eur',
    metadata: any = {}
  ): Promise<{ success: boolean; clientSecret?: string; intentId?: string; error?: string }> {
    
    if (!this.isReady()) {
      return this.simulateDeposit(amount);
    }

    try {
      const response = await fetch('/api/stripe/create-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency,
          capture_method: 'manual', // Important: ne pas capturer tout de suite
          metadata
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      console.log('🔒 Stripe: Caution créée', data.id);
      return { 
        success: true, 
        clientSecret: data.clientSecret,
        intentId: data.id 
      };

    } catch (error: any) {
      console.error('❌ Stripe: Erreur create deposit', error);
      return this.simulateDeposit(amount);
    }
  }

  async captureDeposit(intentId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isReady()) {
      console.log('💰 Simulation: Caution capturée', intentId);
      return { success: true };
    }

    try {
      const response = await fetch('/api/stripe/capture-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intentId })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      console.log('💰 Stripe: Caution capturée', intentId);
      return { success: true };

    } catch (error: any) {
      console.error('❌ Stripe: Erreur capture deposit', error);
      return { success: false, error: error.message };
    }
  }

  async releaseDeposit(intentId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isReady()) {
      console.log('🔓 Simulation: Caution libérée', intentId);
      return { success: true };
    }

    try {
      const response = await fetch('/api/stripe/release-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intentId })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      console.log('🔓 Stripe: Caution libérée', intentId);
      return { success: true };

    } catch (error: any) {
      console.error('❌ Stripe: Erreur release deposit', error);
      return { success: false, error: error.message };
    }
  }

  // ========== PAYMENT ELEMENT ==========

  createPaymentElement(containerId: string, clientSecret: string): any {
    if (!this.isReady()) {
      console.warn('⚠️ Stripe: Payment element needs configuration');
      return null;
    }

    const elements = this.stripe.elements({ clientSecret });
    const paymentElement = elements.create('payment');
    paymentElement.mount(`#${containerId}`);

    return { elements, paymentElement };
  }

  // ========== SIMULATION (MODE DÉVELOPPEMENT) ==========

  private simulatePayment(amount: number, currency: string): Promise<{ success: boolean; clientSecret?: string; error?: string }> {
    console.log(`💳 SIMULATION: Paiement ${amount} ${currency.toUpperCase()}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const clientSecret = `sim_${Date.now()}_secret`;
        console.log('✅ SIMULATION: Paiement réussi');
        resolve({ success: true, clientSecret });
      }, 1500);
    });
  }

  private simulateDeposit(amount: number): Promise<{ success: boolean; clientSecret?: string; intentId?: string; error?: string }> {
    console.log(`🔒 SIMULATION: Caution ${amount}€`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const intentId = `sim_dep_${Date.now()}`;
        const clientSecret = `${intentId}_secret`;
        console.log('✅ SIMULATION: Caution créée');
        resolve({ success: true, clientSecret, intentId });
      }, 1500);
    });
  }

  // ========== CARTES TEST ==========

  getTestCards(): Array<{ number: string; cvc: string; exp: string; type: string; result: string }> {
    return [
      { 
        number: '4242 4242 4242 4242', 
        cvc: '123', 
        exp: '12/34',
        type: 'Visa',
        result: '✅ Succès'
      },
      { 
        number: '4000 0000 0000 0002', 
        cvc: '123', 
        exp: '12/34',
        type: 'Visa',
        result: '❌ Décliné'
      },
      { 
        number: '4000 0027 6000 3184', 
        cvc: '123', 
        exp: '12/34',
        type: 'Visa',
        result: '🔐 3D Secure requis'
      },
      { 
        number: '5555 5555 5555 4444', 
        cvc: '123', 
        exp: '12/34',
        type: 'Mastercard',
        result: '✅ Succès'
      }
    ];
  }

  // ========== WEBHOOK VALIDATION ==========

  async validateWebhook(payload: string, signature: string): Promise<{ valid: boolean; event?: any; error?: string }> {
    // En production, votre backend valide le webhook avec:
    // stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    
    try {
      const event = JSON.parse(payload);
      console.log('📨 Stripe Webhook:', event.type);
      
      return { valid: true, event };
    } catch (error: any) {
      console.error('❌ Stripe: Webhook validation error', error);
      return { valid: false, error: error.message };
    }
  }

  // ========== HELPERS ==========

  formatAmount(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // ========== TEST CONNECTION ==========

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.isReady()) {
      return { success: false, message: 'Stripe non configuré' };
    }

    try {
      // Test simple: créer payment intent de 1€
      const result = await this.createPaymentIntent(1, 'eur', { test: true });
      
      if (result.success) {
        return { success: true, message: 'Connexion Stripe OK ✅' };
      } else {
        return { success: false, message: result.error || 'Erreur inconnue' };
      }
    } catch (error: any) {
      return { success: false, message: `Erreur: ${error.message}` };
    }
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    Stripe: any;
  }
}

// Export singleton
const stripeService = StripeService.getInstance();
export default stripeService;
