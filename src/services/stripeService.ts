// Service de gestion des paiements Stripe
import { loadStripe } from '@stripe/stripe-js';

// Clé publique Stripe (à remplacer par votre vraie clé)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_VOTRE_CLE_PUBLIQUE');

export interface CheckoutSessionData {
  propertyId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  guestCount: number;
  guestName: string;
  guestEmail: string;
  totalAmount: number;
  touristTaxAmount?: number;
}

/**
 * Crée une session de paiement Stripe
 */
export const createCheckoutSession = async (data: CheckoutSessionData) => {
  try {
    // En production, ceci appellerait votre backend
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la session de paiement');
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Erreur Stripe:', error);
    throw error;
  }
};

/**
 * Redirige vers Stripe Checkout
 */
export const redirectToCheckout = async (sessionId: string) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe non initialisé');

    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      console.error('Erreur de redirection Stripe:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la redirection:', error);
    throw error;
  }
};

/**
 * Vérifie le statut d'un paiement
 */
export const checkPaymentStatus = async (sessionId: string) => {
  try {
    const response = await fetch(`/api/check-payment-status?session_id=${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du paiement');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur de vérification:', error);
    throw error;
  }
};

/**
 * Simule un paiement (pour développement/démo)
 */
export const simulatePayment = (data: CheckoutSessionData): Promise<{ success: boolean; bookingId: string }> => {
  return new Promise((resolve) => {
    // Simule un délai de traitement
    setTimeout(() => {
      resolve({
        success: true,
        bookingId: `BK-${Date.now()}`,
      });
    }, 2000);
  });
};

export default {
  createCheckoutSession,
  redirectToCheckout,
  checkPaymentStatus,
  simulatePayment,
};
