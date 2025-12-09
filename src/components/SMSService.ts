// Service d'envoi de SMS via Twilio
// Configuration : TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE dans variables d'environnement

class SMSService {
  private accountSid: string;
  private authToken: string;
  private fromPhone: string;

  constructor() {
    this.accountSid = localStorage.getItem('twilio_account_sid') || '';
    this.authToken = localStorage.getItem('twilio_auth_token') || '';
    this.fromPhone = localStorage.getItem('twilio_from_phone') || '';
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.accountSid || !this.authToken || !this.fromPhone) {
      console.warn('⚠️ Twilio non configuré. SMS simulé.');
      console.log('📱 SMS (simulation) →', to, ':', message);
      return true;
    }

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
      const auth = btoa(`${this.accountSid}:${this.authToken}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: this.fromPhone,
          Body: message
        })
      });

      if (response.ok) {
        console.log('✅ SMS envoyé:', to);
        return true;
      } else {
        const error = await response.text();
        console.error('❌ Erreur Twilio:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      return false;
    }
  }

  // Templates SMS pré-définis
  async sendBookingConfirmationSMS(booking: any): Promise<boolean> {
    const message = `✅ Réservation confirmée !
${booking.propertyName}
Arrivée: ${new Date(booking.checkIn).toLocaleDateString('fr-FR')}
Départ: ${new Date(booking.checkOut).toLocaleDateString('fr-FR')}
Plus d'infos par email.`;

    return this.sendSMS(booking.guestPhone, message);
  }

  async sendPreArrivalSMS(booking: any, accessInfo: any): Promise<boolean> {
    const message = `📍 ${booking.propertyName}
Arrivée dans 3 jours !
Code portail: ${accessInfo.gateCode || 'N/A'}
Boîte à clés: ${accessInfo.keyBoxCode || 'N/A'}
📧 Consultez votre email pour tous les détails.`;

    return this.sendSMS(booking.guestPhone, message);
  }

  async sendCheckoutReminderSMS(booking: any): Promise<boolean> {
    const message = `👋 ${booking.propertyName}
Départ demain avant 11h.
Pensez à :
- Vider les poubelles
- Fermer portes/fenêtres
- Rendre les clés
Merci et à bientôt !`;

    return this.sendSMS(booking.guestPhone, message);
  }

  // Configuration
  setCredentials(accountSid: string, authToken: string, fromPhone: string): void {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromPhone = fromPhone;
    localStorage.setItem('twilio_account_sid', accountSid);
    localStorage.setItem('twilio_auth_token', authToken);
    localStorage.setItem('twilio_from_phone', fromPhone);
  }

  isConfigured(): boolean {
    return !!(this.accountSid && this.authToken && this.fromPhone);
  }
}

export default new SMSService();
