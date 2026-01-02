/**
 * Backend API pour Stripe Checkout
 * 
 * Ce fichier doit être déployé sur votre backend Node.js/Express
 * ou comme fonction serverless (Vercel, Netlify, etc.)
 */

import Stripe from 'stripe';
import express from 'express';
import cors from 'cors';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

app.use(cors());
app.use(express.json());

/**
 * POST /api/create-checkout-session
 * Crée une session de paiement Stripe
 */
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const {
      propertyId,
      propertyName,
      checkIn,
      checkOut,
      nights,
      pricePerNight,
      guestCount,
      guestName,
      guestEmail,
      totalAmount,
      touristTaxAmount,
    } = req.body;

    // Validation des données
    if (!propertyId || !totalAmount || !guestEmail) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: guestEmail,
      
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Réservation: ${propertyName}`,
              description: `${nights} nuit${nights > 1 ? 's' : ''} du ${checkIn} au ${checkOut}`,
              images: [], // Ajoutez l'URL de l'image de la propriété ici
            },
            unit_amount: Math.round(pricePerNight * nights * 100), // En centimes
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Frais de ménage',
            },
            unit_amount: 5000, // 50€ en centimes
          },
          quantity: 1,
        },
      ],

      // Si taxe de séjour
      ...(touristTaxAmount && {
        line_items: [
          ...session.line_items,
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Taxe de séjour',
                description: `${nights} nuits × ${guestCount} voyageur${guestCount > 1 ? 's' : ''}`,
              },
              unit_amount: Math.round(touristTaxAmount * 100),
            },
            quantity: 1,
          },
        ],
      }),

      // URLs de redirection
      success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/booking-cancelled`,

      // Métadonnées pour retrouver la réservation
      metadata: {
        propertyId,
        checkIn,
        checkOut,
        guestCount: guestCount.toString(),
        guestName,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la session de paiement' });
  }
});

/**
 * POST /api/stripe-webhook
 * Webhook pour recevoir les événements Stripe
 */
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).send('Webhook signature missing');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Traitement des événements
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Extraire les données de la réservation
      const {
        propertyId,
        checkIn,
        checkOut,
        guestCount,
        guestName,
      } = session.metadata;

      const guestEmail = session.customer_email;
      const totalPaid = session.amount_total / 100; // Convertir de centimes en euros

      // TODO: Sauvegarder la réservation dans votre base de données
      console.log('💳 Paiement confirmé:', {
        sessionId: session.id,
        propertyId,
        checkIn,
        checkOut,
        guestName,
        guestEmail,
        totalPaid,
      });

      // TODO: Envoyer email de confirmation au client
      // TODO: Envoyer notification au propriétaire
      // TODO: Bloquer les dates dans le calendrier

      break;

    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      console.error('❌ Paiement échoué:', paymentIntent.id);
      
      // TODO: Envoyer email d'échec au client
      
      break;

    default:
      console.log(`Event non géré: ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * GET /api/check-payment-status
 * Vérifie le statut d'une session de paiement
 */
app.get('/api/check-payment-status', async (req, res) => {
  try {
    const sessionId = req.query.session_id as string;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID manquant' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      status: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total / 100,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification du paiement' });
  }
});

/**
 * POST /api/create-refund
 * Crée un remboursement
 */
app.post('/api/create-refund', async (req, res) => {
  try {
    const { sessionId, amount, reason } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID manquant' });
    }

    // Récupérer la session pour obtenir le payment_intent
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentIntentId = session.payment_intent as string;

    // Créer le remboursement
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Montant partiel optionnel
      reason: reason || 'requested_by_customer',
    });

    res.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
    });
  } catch (error) {
    console.error('Erreur lors du remboursement:', error);
    res.status(500).json({ error: 'Erreur lors de la création du remboursement' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend API démarré sur le port ${PORT}`);
  console.log(`📝 Webhook URL: ${process.env.BACKEND_URL}/api/stripe-webhook`);
});

export default app;
