import React from 'react';
import { X, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface MonthDetailsModalProps {
  month: string;
  revenue: number;
  bookings: any[];
  expenses: any[];
  onClose: () => void;
}

const MonthDetailsModal: React.FC<MonthDetailsModalProps> = ({
  month,
  revenue,
  bookings,
  expenses,
  onClose
}) => {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netRevenue = revenue - totalExpenses;

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{monthNames[parseInt(month.split('-')[1]) - 1]} {month.split('-')[0]}</h2>
            <p className="text-green-100 text-sm mt-1">Détails du mois</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-500 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <TrendingUp size={20} />
                <span className="text-sm font-medium">Revenus</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{revenue.toFixed(2)}€</div>
              <div className="text-xs text-gray-600 mt-1">{bookings.length} réservation(s)</div>
            </div>

            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <DollarSign size={20} />
                <span className="text-sm font-medium">Dépenses</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalExpenses.toFixed(2)}€</div>
              <div className="text-xs text-gray-600 mt-1">{expenses.length} dépense(s)</div>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <TrendingUp size={20} />
                <span className="text-sm font-medium">Bénéfice net</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{netRevenue.toFixed(2)}€</div>
              <div className="text-xs text-gray-600 mt-1">Après dépenses</div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              Réservations ({bookings.length})
            </h3>
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Aucune réservation ce mois</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{booking.guestName}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(booking.checkIn).toLocaleDateString('fr-FR')} → {new Date(booking.checkOut).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">{booking.totalPrice.toFixed(2)}€</div>
                        <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmée' :
                           booking.status === 'pending' ? 'En attente' : 'Annulée'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expenses List */}
          {expenses.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-red-600" />
                Dépenses ({expenses.length})
              </h3>
              <div className="space-y-3">
                {expenses.map((expense, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{expense.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {expense.category} • {new Date(expense.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="font-semibold text-red-600">-{expense.amount.toFixed(2)}€</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Graph */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Répartition</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Revenus</span>
                  <span className="text-sm font-semibold text-blue-600">{revenue.toFixed(2)}€</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full" 
                    style={{ width: `${(revenue / (revenue + totalExpenses)) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Dépenses</span>
                  <span className="text-sm font-semibold text-red-600">{totalExpenses.toFixed(2)}€</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-600 h-3 rounded-full" 
                    style={{ width: `${(totalExpenses / (revenue + totalExpenses)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthDetailsModal;
