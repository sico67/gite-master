/**
 * Backend API pour l'envoi d'emails (SendGrid) et SMS (Twilio)
 * 
 * Ce fichier doit être déployé sur votre backend Node.js/Express
 * ou comme fonction serverless (Vercel, Netlify, etc.)
 */

import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Configuration SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Configuration Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * POST /api/send-email
 * Envoie un email via SendGrid
 */
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, content, variables } = req.body;

    if (!to || !subject || !content) {
      return res.status(400).json({ error: 'Données manquantes (to, subject, content requis)' });
    }

    // Remplacer les variables dans le contenu
    let finalContent = content;
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        finalContent = finalContent.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
      });
    }

    // Préparer l'email
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@gitemaster.com',
        name: process.env.SENDGRID_FROM_NAME || 'Gîte Master',
      },
      subject,
      text: finalContent,
      html: finalContent.replace(/\n/g, '<br>'),
    };

    // Envoyer l'email
    await sgMail.send(msg);

    console.log('✅ Email envoyé à:', to);
    res.json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('❌ Erreur SendGrid:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message 
    });
  }
});

/**
 * POST /api/send-sms
 * Envoie un SMS via Twilio
 */
app.post('/api/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Données manquantes (to, message requis)' });
    }

    // Validation du numéro (doit commencer par +)
    if (!to.startsWith('+')) {
      return res.status(400).json({ error: 'Le numéro doit être au format international (+33...)' });
    }

    // Limiter la longueur du SMS
    const truncatedMessage = message.length > 160 ? message.substring(0, 157) + '...' : message;

    // Envoyer le SMS
    const result = await twilioClient.messages.create({
      body: truncatedMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log('✅ SMS envoyé à:', to, '- SID:', result.sid);
    res.json({ 
      success: true, 
      message: 'SMS envoyé avec succès',
      sid: result.sid 
    });
  } catch (error) {
    console.error('❌ Erreur Twilio:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du SMS',
      details: error.message 
    });
  }
});

/**
 * POST /api/send-automated-message
 * Envoie un message automatisé (email + SMS optionnel)
 */
app.post('/api/send-automated-message', async (req, res) => {
  try {
    const {
      template,
      recipientEmail,
      recipientPhone,
      variables,
    } = req.body;

    if (!template || !recipientEmail) {
      return res.status(400).json({ error: 'Template et email destinataire requis' });
    }

    // Remplacer les variables dans le contenu
    let content = template.content;
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
      });
    }

    const results = {
      emailSent: false,
      smsSent: false,
      errors: [],
    };

    // Envoyer l'email
    try {
      const emailMsg = {
        to: recipientEmail,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@gitemaster.com',
          name: process.env.SENDGRID_FROM_NAME || 'Gîte Master',
        },
        subject: template.title,
        text: content,
        html: content.replace(/\n/g, '<br>'),
      };

      await sgMail.send(emailMsg);
      results.emailSent = true;
      console.log('✅ Email automatisé envoyé à:', recipientEmail);
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      results.errors.push(`Email: ${error.message}`);
    }

    // Envoyer le SMS si numéro fourni et message court
    if (recipientPhone && content.length <= 160) {
      try {
        const truncatedMessage = content.substring(0, 160);
        
        await twilioClient.messages.create({
          body: truncatedMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: recipientPhone,
        });
        
        results.smsSent = true;
        console.log('✅ SMS automatisé envoyé à:', recipientPhone);
      } catch (error) {
        console.error('❌ Erreur envoi SMS:', error);
        results.errors.push(`SMS: ${error.message}`);
      }
    }

    res.json({
      success: results.emailSent || results.smsSent,
      ...results,
    });
  } catch (error) {
    console.error('❌ Erreur envoi message automatisé:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du message automatisé',
      details: error.message 
    });
  }
});

/**
 * POST /api/send-booking-confirmation
 * Template prédéfini: Confirmation de réservation
 */
app.post('/api/send-booking-confirmation', async (req, res) => {
  try {
    const {
      guestName,
      guestEmail,
      propertyName,
      checkIn,
      checkOut,
      totalPrice,
      bookingId,
    } = req.body;

    const emailContent = `
Bonjour ${guestName},

Votre réservation est confirmée ! 🎉

📍 Propriété: ${propertyName}
📅 Arrivée: ${checkIn}
📅 Départ: ${checkOut}
💰 Montant total: ${totalPrice}€

Numéro de réservation: ${bookingId}

Vous recevrez les instructions d'arrivée 48h avant votre check-in.

À très bientôt !
L'équipe Gîte Master
    `.trim();

    const msg = {
      to: guestEmail,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@gitemaster.com',
        name: process.env.SENDGRID_FROM_NAME || 'Gîte Master',
      },
      subject: `Confirmation de réservation - ${propertyName}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    };

    await sgMail.send(msg);

    console.log('✅ Confirmation de réservation envoyée à:', guestEmail);
    res.json({ success: true, message: 'Email de confirmation envoyé' });
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi de la confirmation',
      details: error.message 
    });
  }
});

/**
 * GET /api/test-email
 * Test de la configuration SendGrid
 */
app.get('/api/test-email', async (req, res) => {
  try {
    const testEmail = req.query.email as string || 'test@example.com';

    const msg = {
      to: testEmail,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@gitemaster.com',
        name: process.env.SENDGRID_FROM_NAME || 'Gîte Master',
      },
      subject: 'Test SendGrid - Gîte Master',
      text: 'Ceci est un email de test. Si vous le recevez, la configuration SendGrid fonctionne !',
      html: '<p>Ceci est un email de test. Si vous le recevez, la configuration SendGrid fonctionne ! ✅</p>',
    };

    await sgMail.send(msg);
    res.json({ success: true, message: 'Email de test envoyé' });
  } catch (error) {
    console.error('❌ Erreur test SendGrid:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du test',
      details: error.message 
    });
  }
});

/**
 * GET /api/test-sms
 * Test de la configuration Twilio
 */
app.get('/api/test-sms', async (req, res) => {
  try {
    const testPhone = req.query.phone as string;

    if (!testPhone) {
      return res.status(400).json({ error: 'Numéro de téléphone requis (?phone=+33...)' });
    }

    const result = await twilioClient.messages.create({
      body: 'Test SMS Gîte Master - Si vous recevez ce message, la configuration Twilio fonctionne ! ✅',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: testPhone,
    });

    res.json({ 
      success: true, 
      message: 'SMS de test envoyé',
      sid: result.sid 
    });
  } catch (error) {
    console.error('❌ Erreur test Twilio:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du test SMS',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend API démarré sur le port ${PORT}`);
  console.log(`📧 SendGrid configuré: ${process.env.SENDGRID_FROM_EMAIL}`);
  console.log(`📱 Twilio configuré: ${process.env.TWILIO_PHONE_NUMBER}`);
});

export default app;
