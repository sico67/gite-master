// Service de calcul de la taxe de séjour
import { Property, Reservation } from '../types';
import { differenceInDays } from 'date-fns';

export interface TouristTaxCalculation {
  propertyId: string;
  reservationId: string;
  nights: number;
  guests: number;
  ratePerPersonPerNight: number;
  totalTax: number;
  city: string;
}

export interface TouristTaxReport {
  period: { start: Date; end: Date };
  propertyId: string;
  totalNights: number;
  totalGuests: number;
  totalTaxAmount: number;
  reservationsCount: number;
  details: TouristTaxCalculation[];
}

/**
 * Taux de taxe de séjour par ville (en euros par personne et par nuit)
 * Source: https://www.collectivites-locales.gouv.fr/
 */
export const TOURIST_TAX_RATES: Record<string, { rate: number; category: string }> = {
  'Paris': { rate: 3.25, category: 'Meublé de tourisme 5 étoiles' },
  'Lyon': { rate: 2.30, category: 'Meublé de tourisme 4 étoiles' },
  'Marseille': { rate: 2.30, category: 'Meublé de tourisme 4 étoiles' },
  'Nice': { rate: 2.53, category: 'Meublé de tourisme 4 étoiles' },
  'Bordeaux': { rate: 1.98, category: 'Meublé de tourisme 4 étoiles' },
  'Strasbourg': { rate: 2.30, category: 'Meublé de tourisme 4 étoiles' },
  'Toulouse': { rate: 1.65, category: 'Meublé de tourisme 3 étoiles' },
  'Montpellier': { rate: 1.65, category: 'Meublé de tourisme 3 étoiles' },
  // Tarif par défaut pour les petites communes
  'default': { rate: 0.80, category: 'Meublé de tourisme classé' },
};

/**
 * Calcule la taxe de séjour pour une réservation
 */
export const calculateTouristTax = (
  reservation: Reservation,
  property: Property
): TouristTaxCalculation => {
  const nights = differenceInDays(reservation.checkOut, reservation.checkIn);
  const guests = reservation.guestCount || 1;
  
  // Récupère le taux de taxe pour la ville ou utilise le taux par défaut
  const city = property.touristTaxCity || 'default';
  const taxRate = property.touristTaxRate || TOURIST_TAX_RATES[city]?.rate || TOURIST_TAX_RATES['default'].rate;
  
  const totalTax = nights * guests * taxRate;

  return {
    propertyId: property.id,
    reservationId: reservation.id,
    nights,
    guests,
    ratePerPersonPerNight: taxRate,
    totalTax: Math.round(totalTax * 100) / 100, // Arrondi à 2 décimales
    city,
  };
};

/**
 * Génère un rapport de taxe de séjour pour une période
 */
export const generateTouristTaxReport = (
  reservations: Reservation[],
  properties: Property[],
  startDate: Date,
  endDate: Date,
  propertyId?: string
): TouristTaxReport[] => {
  // Filtre les réservations par période et propriété
  const filteredReservations = reservations.filter(r => {
    const inPeriod = r.checkIn >= startDate && r.checkIn <= endDate;
    const matchesProperty = !propertyId || r.propertyId === propertyId;
    const isConfirmed = r.status === 'confirmed';
    return inPeriod && matchesProperty && isConfirmed;
  });

  // Groupe par propriété
  const reportsByProperty: Record<string, TouristTaxReport> = {};

  filteredReservations.forEach(reservation => {
    const property = properties.find(p => p.id === reservation.propertyId);
    if (!property) return;

    if (!reportsByProperty[property.id]) {
      reportsByProperty[property.id] = {
        period: { start: startDate, end: endDate },
        propertyId: property.id,
        totalNights: 0,
        totalGuests: 0,
        totalTaxAmount: 0,
        reservationsCount: 0,
        details: [],
      };
    }

    const calculation = calculateTouristTax(reservation, property);
    
    reportsByProperty[property.id].totalNights += calculation.nights;
    reportsByProperty[property.id].totalGuests += calculation.guests;
    reportsByProperty[property.id].totalTaxAmount += calculation.totalTax;
    reportsByProperty[property.id].reservationsCount += 1;
    reportsByProperty[property.id].details.push(calculation);
  });

  return Object.values(reportsByProperty);
};

/**
 * Génère une déclaration de taxe de séjour (format texte)
 */
export const generateTaxDeclaration = (report: TouristTaxReport, property: Property): string => {
  const declaration = `
═══════════════════════════════════════════════════════════
        DÉCLARATION DE TAXE DE SÉJOUR
═══════════════════════════════════════════════════════════

PROPRIÉTÉ: ${property.name}
ADRESSE: ${property.address}
PÉRIODE: ${report.period.start.toLocaleDateString('fr-FR')} - ${report.period.end.toLocaleDateString('fr-FR')}

───────────────────────────────────────────────────────────
RÉCAPITULATIF
───────────────────────────────────────────────────────────
Nombre de réservations:    ${report.reservationsCount}
Nombre de nuitées:         ${report.totalNights}
Nombre total de voyageurs: ${report.totalGuests}
Taux appliqué:             ${property.touristTaxRate || 0.80}€ / personne / nuit

MONTANT TOTAL À DÉCLARER:  ${report.totalTaxAmount.toFixed(2)} €

───────────────────────────────────────────────────────────
DÉTAIL DES RÉSERVATIONS
───────────────────────────────────────────────────────────
${report.details.map((d, i) => `
${i + 1}. Réservation ${d.reservationId.substring(0, 8)}
   Nuitées: ${d.nights} | Voyageurs: ${d.guests}
   Taxe: ${d.totalTax.toFixed(2)} €
`).join('')}

═══════════════════════════════════════════════════════════
Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
Gîte Master - Gestion de Locations Saisonnières
═══════════════════════════════════════════════════════════
  `;

  return declaration;
};

/**
 * Exporte le rapport au format CSV
 */
export const exportTaxReportToCSV = (report: TouristTaxReport): string => {
  let csv = 'Réservation ID,Nuitées,Voyageurs,Taux,Montant Taxe\n';
  
  report.details.forEach(detail => {
    csv += `${detail.reservationId},${detail.nights},${detail.guests},${detail.ratePerPersonPerNight},${detail.totalTax}\n`;
  });
  
  csv += `\nTOTAL,${report.totalNights},${report.totalGuests},,${report.totalTaxAmount}\n`;
  
  return csv;
};

/**
 * Télécharge le rapport de taxe au format CSV
 */
export const downloadTaxReport = (report: TouristTaxReport, property: Property): void => {
  const csv = exportTaxReportToCSV(report);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `taxe_sejour_${property.name.replace(/\s+/g, '_')}_${report.period.start.toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Vérifie si une réservation doit être soumise à la taxe de séjour
 */
export const isSubjectToTouristTax = (reservation: Reservation): boolean => {
  // Exemptions possibles:
  // - Mineurs (si on a l'info d'âge)
  // - Séjours gratuits
  // - Locations longue durée (> 90 jours)
  
  const nights = differenceInDays(reservation.checkOut, reservation.checkIn);
  const isLongStay = nights > 90;
  const isFree = (reservation.totalPrice || 0) === 0;
  
  return !isLongStay && !isFree && reservation.status === 'confirmed';
};

export default {
  calculateTouristTax,
  generateTouristTaxReport,
  generateTaxDeclaration,
  exportTaxReportToCSV,
  downloadTaxReport,
  isSubjectToTouristTax,
  TOURIST_TAX_RATES,
};
