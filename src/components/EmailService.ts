// Service d'envoi d'emails via SendGrid
// Configuration : SENDGRID_API_KEY dans variables d'environnement

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    // En production : process.env.SENDGRID_API_KEY
    // En dev : localStorage pour tests
    this.apiKey = localStorage.getItem('sendgrid_api_key') || '';
    this.fromEmail = localStorage.getItem('from_email') || 'noreply@votregite.com';
    this.fromName = localStorage.getItem('from_name') || 'Votre Gîte';
  }

  async sendEmail(template: EmailTemplate): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('⚠️ SendGrid API key non configurée. Email simulé.');
      console.log('📧 Email (simulation):', template);
      return true;
    }

    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: template.to }],
            subject: template.subject
          }],
          from: {
            email: this.fromEmail,
            name: this.fromName
          },
          content: [{
            type: 'text/html',
            value: template.html
          }]
        })
      });

      if (response.ok || response.status === 202) {
        console.log('✅ Email envoyé:', template.to);
        return true;
      } else {
        const error = await response.text();
        console.error('❌ Erreur SendGrid:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      return false;
    }
  }

  // Templates pré-définis
  async sendBookingConfirmation(booking: any): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Réservation confirmée !</h1>
          </div>
          <div class="content">
            <p>Bonjour ${booking.guestName},</p>
            <p>Nous sommes ravis de confirmer votre réservation à <strong>${booking.propertyName}</strong>.</p>
            
            <div class="info-box">
              <h3>📅 Détails de votre séjour</h3>
              <p><strong>Arrivée :</strong> ${new Date(booking.checkIn).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><strong>Départ :</strong> ${new Date(booking.checkOut).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><strong>Voyageurs :</strong> ${booking.adults} adulte(s) ${booking.children > 0 ? `+ ${booking.children} enfant(s)` : ''}</p>
            </div>

            <div class="info-box">
              <h3>💰 Montant total</h3>
              <p style="font-size: 24px; color: #667eea; font-weight: bold;">${booking.totalPrice}€</p>
            </div>

            <p>Vous recevrez un email avec toutes les informations pratiques 3 jours avant votre arrivée.</p>
            
            <p>À très bientôt !<br>L'équipe ${booking.propertyName}</p>
          </div>
          <div class="footer">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: booking.guestEmail,
      subject: `✅ Réservation confirmée - ${booking.propertyName}`,
      html
    });
  }

  async sendPreArrivalInfo(booking: any, accessInfo: any): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 15px 0; }
          .qr-code { text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📍 Infos pratiques</h1>
            <p>Votre arrivée dans 3 jours !</p>
          </div>
          <div class="content">
            <p>Bonjour ${booking.guestName},</p>
            <p>Votre séjour approche ! Voici toutes les informations dont vous aurez besoin.</p>
            
            <div class="info-box">
              <h3>🏠 Adresse</h3>
              <p><strong>${accessInfo.address}</strong></p>
              <a href="https://maps.google.com/?q=${encodeURIComponent(accessInfo.address)}" style="color: #667eea;">📍 Ouvrir dans Google Maps</a>
            </div>

            <div class="highlight">
              <h3>🔑 Accès</h3>
              <p><strong>Code portail :</strong> ${accessInfo.gateCode || 'N/A'}</p>
              <p><strong>Boîte à clés :</strong> ${accessInfo.keyBoxCode || 'N/A'}</p>
              <p>${accessInfo.instructions || ''}</p>
            </div>

            <div class="info-box">
              <h3>📶 WiFi</h3>
              <p><strong>Réseau :</strong> ${accessInfo.wifiSSID || 'N/A'}</p>
              <p><strong>Mot de passe :</strong> ${accessInfo.wifiPassword || 'N/A'}</p>
            </div>

            <div class="info-box">
              <h3>📞 Contact</h3>
              <p><strong>Téléphone :</strong> ${accessInfo.phone || 'N/A'}</p>
              <p>Disponible 7j/7 de 9h à 20h</p>
            </div>

            ${accessInfo.guideLink ? `
              <div class="qr-code">
                <p>📱 <strong>Livret d'accueil numérique</strong></p>
                <img src="${accessInfo.guideLink}" alt="QR Code" style="max-width: 200px;">
                <p><small>Scannez ce code pour accéder au guide complet</small></p>
              </div>
            ` : ''}

            <p>Nous vous souhaitons un excellent séjour !<br>L'équipe ${booking.propertyName}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: booking.guestEmail,
      subject: `📍 Infos pratiques - Arrivée J-3`,
      html
    });
  }

  async sendReviewRequest(booking: any, reviewLinks: any): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .review-button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px; font-weight: bold; }
          .stars { text-align: center; font-size: 40px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⭐ Votre avis compte !</h1>
          </div>
          <div class="content">
            <p>Bonjour ${booking.guestName},</p>
            <p>Nous espérons que vous avez passé un excellent séjour à <strong>${booking.propertyName}</strong> !</p>
            
            <div class="stars">⭐⭐⭐⭐⭐</div>
            
            <p style="text-align: center;">Votre avis nous aide énormément à améliorer nos services et aide d'autres voyageurs à faire leur choix.</p>
            
            <p style="text-align: center;"><strong>Pourriez-vous prendre 2 minutes pour laisser un avis ?</strong></p>

            <div style="text-align: center; margin: 30px 0;">
              ${reviewLinks.google ? `<a href="${reviewLinks.google}" class="review-button">⭐ Google</a>` : ''}
              ${reviewLinks.airbnb ? `<a href="${reviewLinks.airbnb}" class="review-button">🏠 Airbnb</a>` : ''}
              ${reviewLinks.booking ? `<a href="${reviewLinks.booking}" class="review-button">🌐 Booking</a>` : ''}
            </div>

            <p style="text-align: center;">Merci infiniment pour votre confiance !<br>À bientôt 😊</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: booking.guestEmail,
      subject: `⭐ Votre avis sur ${booking.propertyName}`,
      html
    });
  }

  // Configuration
  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('sendgrid_api_key', key);
  }

  setFromEmail(email: string, name: string): void {
    this.fromEmail = email;
    this.fromName = name;
    localStorage.setItem('from_email', email);
    localStorage.setItem('from_name', name);
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export default new EmailService();
