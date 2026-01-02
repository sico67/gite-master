import React, { useState, useMemo } from 'react';
import { FileText, Download, Calendar, DollarSign, Users, Home, TrendingUp } from 'lucide-react';
import { PROPERTIES, RESERVATIONS } from '../services/mockData';
import { generateTouristTaxReport, generateTaxDeclaration, downloadTaxReport } from '../services/touristTaxService';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

const TouristTaxReport: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(format(currentDate, 'yyyy-MM'));
  const [selectedProperty, setSelectedProperty] = useState<string>('all');

  // Calcule la période sélectionnée
  const period = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
    };
  }, [selectedMonth]);

  // Génère les rapports de taxe
  const reports = useMemo(() => {
    return generateTouristTaxReport(
      RESERVATIONS,
      PROPERTIES,
      period.start,
      period.end,
      selectedProperty === 'all' ? undefined : selectedProperty
    );
  }, [period, selectedProperty]);

  // Calcule les totaux
  const totals = useMemo(() => {
    return reports.reduce(
      (acc, report) => ({
        nights: acc.nights + report.totalNights,
        guests: acc.guests + report.totalGuests,
        amount: acc.amount + report.totalTaxAmount,
        reservations: acc.reservations + report.reservationsCount,
      }),
      { nights: 0, guests: 0, amount: 0, reservations: 0 }
    );
  }, [reports]);

  const handleDownloadDeclaration = (reportIndex: number) => {
    const report = reports[reportIndex];
    const property = PROPERTIES.find(p => p.id === report.propertyId);
    if (!property) return;

    const declaration = generateTaxDeclaration(report, property);
    const blob = new Blob([declaration], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `declaration_taxe_sejour_${property.name.replace(/\s+/g, '_')}_${selectedMonth}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = (reportIndex: number) => {
    const report = reports[reportIndex];
    const property = PROPERTIES.find(p => p.id === report.propertyId);
    if (!property) return;

    downloadTaxReport(report, property);
  };

  // Génère les options de mois (12 derniers mois)
  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 12; i++) {
      const date = subMonths(currentDate, i);
      options.push({
        value: format(date, 'yyyy-MM'),
        label: format(date, 'MMMM yyyy', { locale: fr }),
      });
    }
    return options;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header avec filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-blue-600" />
              Taxe de Séjour
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Déclarations et calculs automatiques
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <select
              className="border rounded-lg px-4 py-2 text-sm bg-white"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className="border rounded-lg px-4 py-2 text-sm bg-white"
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
            >
              <option value="all">Toutes les propriétés</option>
              {PROPERTIES.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totals.amount.toFixed(2)} €</p>
          <p className="text-xs text-gray-500 mt-1">Montant Total</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <Calendar className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totals.nights}</p>
          <p className="text-xs text-gray-500 mt-1">Nuitées Taxables</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totals.guests}</p>
          <p className="text-xs text-gray-500 mt-1">Voyageurs</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Home className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totals.reservations}</p>
          <p className="text-xs text-gray-500 mt-1">Réservations</p>
        </div>
      </div>

      {/* Rapports par propriété */}
      {reports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">Aucune réservation taxable pour cette période</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report, index) => {
            const property = PROPERTIES.find(p => p.id === report.propertyId);
            if (!property) return null;

            return (
              <div key={report.propertyId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{property.name}</h3>
                      <p className="text-blue-100 text-sm">{property.address}</p>
                      <p className="text-blue-200 text-xs mt-2">
                        Taux: {property.touristTaxRate || 0.80}€ / personne / nuit
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{report.totalTaxAmount.toFixed(2)} €</p>
                      <p className="text-blue-100 text-sm">À déclarer</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x border-b">
                  <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{report.reservationsCount}</p>
                    <p className="text-xs text-gray-500">Réservations</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{report.totalNights}</p>
                    <p className="text-xs text-gray-500">Nuitées</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{report.totalGuests}</p>
                    <p className="text-xs text-gray-500">Voyageurs</p>
                  </div>
                </div>

                {/* Détails */}
                <div className="p-6">
                  <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Détail des Réservations
                  </h4>
                  <div className="space-y-2">
                    {report.details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                        <span className="text-gray-600">Réservation #{detail.reservationId.substring(0, 8)}</span>
                        <div className="flex gap-4 items-center">
                          <span className="text-gray-500">{detail.nights} nuits × {detail.guests} pers.</span>
                          <span className="font-bold text-gray-900">{detail.totalTax.toFixed(2)} €</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 border-t flex gap-3">
                  <button
                    onClick={() => handleDownloadDeclaration(index)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                  >
                    <FileText size={18} />
                    Télécharger Déclaration
                  </button>
                  <button
                    onClick={() => handleDownloadCSV(index)}
                    className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    <Download size={18} />
                    Export CSV
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-blue-900 mb-2">ℹ️ Informations importantes</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• La taxe de séjour doit être déclarée mensuellement ou trimestriellement selon votre commune</li>
          <li>• Les mineurs de moins de 18 ans sont exemptés de la taxe de séjour</li>
          <li>• Les séjours de plus de 90 jours consécutifs ne sont pas soumis à la taxe</li>
          <li>• Conservez les justificatifs de déclaration pendant 6 ans minimum</li>
        </ul>
      </div>
    </div>
  );
};

export default TouristTaxReport;
