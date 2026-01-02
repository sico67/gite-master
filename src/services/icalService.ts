// Service de génération et synchronisation iCal
import { Reservation, Property } from '../types';
import { format } from 'date-fns';

/**
 * Formate une date au format iCal (YYYYMMDD)
 */
const formatICalDate = (date: Date): string => {
  return format(date, 'yyyyMMdd');
};

/**
 * Formate une date avec heure au format iCal (YYYYMMDDTHHmmss)
 */
const formatICalDateTime = (date: Date): string => {
  return format(date, "yyyyMMdd'T'HHmmss");
};

/**
 * Génère un fichier iCal pour une propriété
 */
export const generateICalFeed = (
  propertyId: string,
  propertyName: string,
  reservations: Reservation[]
): string => {
  const filteredReservations = reservations.filter(r => r.propertyId === propertyId);

  let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Gite Master//Calendar//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${propertyName}
X-WR-TIMEZONE:Europe/Paris
X-WR-CALDESC:Calendrier de réservations pour ${propertyName}
`;

  filteredReservations.forEach(reservation => {
    const uid = `${reservation.id}@gitemaster.com`;
    const summary = reservation.status === 'blocked' 
      ? 'Bloqué' 
      : `Réservation: ${reservation.guestName}`;
    
    const description = reservation.status === 'blocked'
      ? 'Période bloquée'
      : `Voyageur: ${reservation.guestName}\\nNombre de personnes: ${reservation.guestCount || 1}\\nSource: ${reservation.source}`;

    ical += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatICalDateTime(new Date())}
DTSTART;VALUE=DATE:${formatICalDate(reservation.checkIn)}
DTEND;VALUE=DATE:${formatICalDate(reservation.checkOut)}
SUMMARY:${summary}
DESCRIPTION:${description}
STATUS:${reservation.status === 'confirmed' ? 'CONFIRMED' : 'TENTATIVE'}
TRANSP:OPAQUE
SEQUENCE:0
END:VEVENT
`;
  });

  ical += `END:VCALENDAR`;
  
  return ical;
};

/**
 * Parse un fichier iCal importé depuis Airbnb/Booking
 */
export const parseICalFeed = (icalContent: string, propertyId: string, source: 'airbnb' | 'booking' | 'vrbo'): Reservation[] => {
  const reservations: Reservation[] = [];
  
  // Split par événements
  const events = icalContent.split('BEGIN:VEVENT');
  
  events.forEach(event => {
    if (!event.includes('DTSTART')) return;
    
    try {
      const dtstart = event.match(/DTSTART[;:].*?:(\d{8})/)?.[1];
      const dtend = event.match(/DTEND[;:].*?:(\d{8})/)?.[1];
      const summary = event.match(/SUMMARY:(.*?)[\n\r]/)?.[1]?.trim() || 'Réservation';
      const uid = event.match(/UID:(.*?)[\n\r]/)?.[1]?.trim() || `import-${Date.now()}`;
      
      if (dtstart && dtend) {
        const checkIn = new Date(
          parseInt(dtstart.substring(0, 4)),
          parseInt(dtstart.substring(4, 6)) - 1,
          parseInt(dtstart.substring(6, 8))
        );
        
        const checkOut = new Date(
          parseInt(dtend.substring(0, 4)),
          parseInt(dtend.substring(4, 6)) - 1,
          parseInt(dtend.substring(6, 8))
        );
        
        reservations.push({
          id: uid,
          propertyId,
          guestName: summary,
          checkIn,
          checkOut,
          status: 'confirmed',
          source,
        });
      }
    } catch (error) {
      console.error('Erreur de parsing iCal:', error);
    }
  });
  
  return reservations;
};

/**
 * Synchronise les réservations depuis une URL iCal externe
 */
export const syncFromICalUrl = async (
  url: string,
  propertyId: string,
  source: 'airbnb' | 'booking' | 'vrbo'
): Promise<Reservation[]> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const icalContent = await response.text();
    return parseICalFeed(icalContent, propertyId, source);
  } catch (error) {
    console.error('Erreur de synchronisation iCal:', error);
    throw error;
  }
};

/**
 * Génère un fichier .ics téléchargeable
 */
export const downloadICalFile = (propertyName: string, icalContent: string): void => {
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${propertyName.replace(/\s+/g, '_')}_calendar.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Génère une URL publique pour le flux iCal (à héberger sur votre serveur)
 */
export const getPublicICalUrl = (propertyId: string): string => {
  // En production, ceci serait l'URL publique de votre serveur
  return `${window.location.origin}/api/ical/${propertyId}`;
};

/**
 * Détecte les conflits de réservation
 */
export const detectConflicts = (
  newReservation: { checkIn: Date; checkOut: Date },
  existingReservations: Reservation[]
): Reservation[] => {
  return existingReservations.filter(existing => {
    const newStart = newReservation.checkIn.getTime();
    const newEnd = newReservation.checkOut.getTime();
    const existingStart = existing.checkIn.getTime();
    const existingEnd = existing.checkOut.getTime();
    
    // Vérifie si les dates se chevauchent
    return (
      (newStart < existingEnd && newEnd > existingStart) ||
      (existingStart < newEnd && existingEnd > newStart)
    );
  });
};

export default {
  generateICalFeed,
  parseICalFeed,
  syncFromICalUrl,
  downloadICalFile,
  getPublicICalUrl,
  detectConflicts,
};
