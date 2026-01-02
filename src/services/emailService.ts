// Service d'envoi d'emails automatisés
import { MessageTemplate } from '../types';

export interface EmailData {
  to: string;
  subject: string;
  content: string;
  variables?: Record<string, string>;
}

export interface SMSData {
  to: string; // Format: +33612345678
  message: string;
}

/**
 * Remplace les variables dans un template
 */
export const replaceTemplateVariables = (
  content: string,
  variables: Record<string, string>
): string => {
  let result = content;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return result;
};

/**
 * Envoie un email via SendGrid
 */
export const sendEmail = async (data: EmailData): Promise<boolean> => {
  try {
    // En production, ceci appellerait votre backend
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }

    const result = await response.json();
    console.log('Email envoyé avec succès:', result);
    return true;
  } catch (error) {
    console.error('Erreur d\'envoi email:', error);
    return false;
  }
};

/**
 * Envoie un SMS via Twilio
 */
export const sendSMS = async (data: SMSData): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi du SMS');
    }

    const result = await response.json();
    console.log('SMS envoyé avec succès:', result);
    return true;
  } catch (error) {
    console.error('Erreur d\'envoi SMS:', error);
    return false;
  }
};

/**
 * Envoie un message automatisé basé sur un template
 */
export const sendAutomatedMessage = async (
  template: MessageTemplate,
  recipientEmail: string,
  recipientPhone: string | null,
  variables: Record<string, string>
): Promise<{ emailSent: boolean; smsSent: boolean }> => {
  const content = replaceTemplateVariables(template.content, variables);
  
  // Envoi email
  const emailSent = await sendEmail({
    to: recipientEmail,
    subject: template.title,
    content: content,
  });

  // Envoi SMS (optionnel si numéro fourni)
  let smsSent = false;
  if (recipientPhone && content.length <= 160) {
    smsSent = await sendSMS({
      to: recipientPhone,
      message: content.substring(0, 160),
    });
  }

  return { emailSent, smsSent };
};

/**
 * Simule l'envoi d'un message (pour développement/démo)
 */
export const simulateSendMessage = (
  template: MessageTemplate,
  variables: Record<string, string>
): Promise<{ success: boolean; messagePreview: string }> => {
  return new Promise((resolve) => {
    const messagePreview = replaceTemplateVariables(template.content, variables);
    
    setTimeout(() => {
      console.log('📧 Message simulé envoyé:');
      console.log('Sujet:', template.title);
      console.log('Contenu:', messagePreview);
      
      resolve({
        success: true,
        messagePreview,
      });
    }, 1000);
  });
};

/**
 * Programme l'envoi d'un message automatisé
 */
export const scheduleAutomatedMessage = (
  template: MessageTemplate,
  sendDate: Date,
  recipientEmail: string,
  recipientPhone: string | null,
  variables: Record<string, string>
): void => {
  const now = new Date();
  const delay = sendDate.getTime() - now.getTime();

  if (delay <= 0) {
    // Envoyer immédiatement
    sendAutomatedMessage(template, recipientEmail, recipientPhone, variables);
  } else {
    // Programmer l'envoi
    setTimeout(() => {
      sendAutomatedMessage(template, recipientEmail, recipientPhone, variables);
    }, delay);
    
    console.log(`📅 Message programmé pour: ${sendDate.toLocaleString()}`);
  }
};

export default {
  sendEmail,
  sendSMS,
  sendAutomatedMessage,
  simulateSendMessage,
  scheduleAutomatedMessage,
  replaceTemplateVariables,
};
