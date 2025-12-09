import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  Download,
  Calendar,
  Home,
  CreditCard,
  Receipt,
  Building2
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  type: 'revenue' | 'expense';
  category: string;
  description: string;
  amount: number;
  property: string;
  bookingId?: string;
}

interface TouristTax {
  bookingId: string;
  guestName: string;
  property: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  taxPerNight: number;
  totalTax: number;
  status: 'pending' | 'declared' | 'paid';
}

const AccountingModule: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear] = useState(2025);

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2025-12-12',
      type: 'revenue',
      category: 'Réservation',
      description: 'Marie Dubois - Villa Exemple',
      amount: 980,
      property: 'Villa Exemple',
      bookingId: 'b1'
    },
    {
      id: '2',
      date: '2025-12-05',
      type: 'revenue',
      category: 'Réservation',
      description: 'Sophie Laurent - Villa Exemple',
      amount: 420,
      property: 'Villa Exemple',
      bookingId: 'b3'
    },
    {
      id: '3',
      date: '2025-12-01',
      type: 'expense',
      category: 'Ménage',
      description: 'Service de ménage',
      amount: -80,
      property: 'Villa Exemple'
    },
    {
      id: '4',
      date: '2025-12-03',
      type: 'expense',
      category: 'Maintenance',
      description: 'Réparation plomberie',
      amount: -150,
      property: 'Villa Exemple'
    },
    {
      id: '5',
      date: '2025-12-10',
      type: 'expense',
      category: 'Fournitures',
      description: 'Produits d\'entretien',
      amount: -45,
      property: 'Villa Exemple'
    }
  ]);

  const [touristTaxes] = useState<TouristTax[]>([
    {
      bookingId: 'b1',
      guestName: 'Marie Dubois',
      property: 'Villa Exemple',
      checkIn: '2025-12-12',
      checkOut: '2025-12-19',
      nights: 7,
      adults: 2,
      taxPerNight: 0.80,
      totalTax: 11.20,
      status: 'pending'
    },
    {
      bookingId: 'b2',
      guestName: 'Jean Martin',
      property: 'Villa Exemple',
      checkIn: '2025-12-22',
      checkOut: '2025-12-28',
      nights: 6,
      adults: 2,
      taxPerNight: 0.80,
      totalTax: 9.60,
      status: 'pending'
    },
    {
      bookingId: 'b3',
      guestName: 'Sophie Laurent',
      property: 'Villa Exemple',
      checkIn: '2025-12-05',
      checkOut: '2025-12-08',
      nights: 3,
      adults: 3,
      taxPerNight: 0.80,
      totalTax: 7.20,
      status: 'declared'
    }
  ]);

  const totalRevenue = transactions
    .filter(t => t.type === 'revenue')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0));

  const netProfit = totalRevenue - totalExpenses;

  const totalTouristTax = touristTaxes.reduce((sum, t) => sum + t.totalTax, 0);
  const pendingTax = touristTaxes
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.totalTax, 0);

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const categories = Object.entries(expensesByCategory).map(([name, amount]) => ({
    name,
    amount,
    percentage: (amount / totalExpenses) * 100
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declared': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'À déclarer';
      case 'declared': return 'Déclarée';
      case 'paid': return 'Payée';
      default: return status;
    }
  };

  const handleExportExcel = () => {
    alert('Export Excel à venir ! (Fonction de démonstration)');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💰 Comptabilité</h1>
          <p className="text-gray-600 mt-1">Revenus, dépenses et taxe de séjour</p>
        </div>
        
        <button
          onClick={handleExportExcel}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          <Download size={20} />
          <span>Exporter Excel</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div 
          onClick={() => {
            const revenueList = transactions
              .filter(t => t.type === 'revenue')
              .map(t => `${new Date(t.date).toLocaleDateString('fr-FR')}: ${t.description} - ${t.amount}€`)
              .join('\n');
            alert(`💰 REVENUS TOTAUX\n\n${totalRevenue.toLocaleString()}€\n\nDétails:\n${revenueList}`);
          }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalRevenue.toLocaleString()}€</p>
          <p className="text-sm text-gray-600 mt-1">Revenus totaux</p>
        </div>

        <div 
          onClick={() => {
            const expenseList = transactions
              .filter(t => t.type === 'expense')
              .map(t => `${new Date(t.date).toLocaleDateString('fr-FR')}: ${t.description} - ${Math.abs(t.amount)}€`)
              .join('\n');
            alert(`📉 DÉPENSES TOTALES\n\n${totalExpenses.toLocaleString()}€\n\nDétails:\n${expenseList}`);
          }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalExpenses.toLocaleString()}€</p>
          <p className="text-sm text-gray-600 mt-1">Dépenses totales</p>
        </div>

        <div 
          onClick={() => {
            alert(`💵 BÉNÉFICE NET\n\nRevenus: ${totalRevenue.toLocaleString()}€\nDépenses: ${totalExpenses.toLocaleString()}€\n\nNet: ${netProfit.toLocaleString()}€\n\nMarge: ${((netProfit / totalRevenue) * 100).toFixed(1)}%`);
          }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netProfit.toLocaleString()}€
          </p>
          <p className="text-sm text-gray-600 mt-1">Bénéfice net</p>
        </div>

        <div 
          onClick={() => {
            const taxList = touristTaxes
              .map(t => `${t.guestName} (${t.nights}n × ${t.adults}p): ${t.totalTax.toFixed(2)}€ - ${getStatusText(t.status)}`)
              .join('\n');
            alert(`🏛️ TAXE DE SÉJOUR\n\nTotal: ${totalTouristTax.toFixed(2)}€\nÀ déclarer: ${pendingTax.toFixed(2)}€\n\nDétails:\n${taxList}`);
          }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalTouristTax.toFixed(2)}€</p>
          <p className="text-sm text-gray-600 mt-1">Taxe de séjour</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Dernières transactions</h2>
          
          <div className="space-y-3">
            {transactions.map(transaction => (
              <div
                key={transaction.id}
                onClick={() => {
                  if (transaction.bookingId) {
                    alert(`Ouvrir réservation ${transaction.bookingId} - ${transaction.description}`);
                  } else {
                    alert(`Détails: ${transaction.description}\nMontant: ${transaction.amount}€\nDate: ${new Date(transaction.date).toLocaleDateString('fr-FR')}`);
                  }
                }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'revenue' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'revenue' ? (
                      <TrendingUp className="text-green-600" size={20} />
                    ) : (
                      <TrendingDown className="text-red-600" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.category} • {new Date(transaction.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${
                  transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'revenue' ? '+' : ''}{transaction.amount.toLocaleString()}€
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Dépenses par catégorie</h2>
          
          <div className="space-y-4">
            {categories.map(category => (
              <div 
                key={category.name}
                onClick={() => {
                  const categoryTransactions = transactions
                    .filter(t => t.category === category.name)
                    .map(t => `${t.description}: ${t.amount}€`)
                    .join('\n');
                  alert(`${category.name}\nTotal: ${category.amount}€\n\nDétails:\n${categoryTransactions}`);
                }}
                className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm font-bold text-gray-900">{category.amount}€</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{category.percentage.toFixed(1)}% du total</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tourist Tax Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="text-purple-600" size={24} />
              Taxe de séjour automatique
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Calcul automatique selon la réglementation 2025
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">{pendingTax.toFixed(2)}€</p>
            <p className="text-sm text-gray-600">À déclarer</p>
          </div>
        </div>

        {/* Tax Info Banner */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Receipt className="text-purple-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-medium text-purple-900 mb-1">ℹ️ Information</p>
              <p className="text-sm text-purple-800">
                La taxe de séjour est calculée automatiquement : <strong>0,80€ par personne et par nuit</strong> (tarif 2025 pour locations classées).
                Elle doit être déclarée mensuellement avant le 15 du mois suivant.
              </p>
            </div>
          </div>
        </div>

        {/* Tax Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Client</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Dates</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Nuits</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Adultes</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Tarif/nuit</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {touristTaxes.map(tax => (
                <tr 
                  key={tax.bookingId} 
                  onClick={() => {
                    alert(`Taxe de séjour\n\nClient: ${tax.guestName}\nPropriété: ${tax.property}\nArrivée: ${new Date(tax.checkIn).toLocaleDateString('fr-FR')}\nDépart: ${new Date(tax.checkOut).toLocaleDateString('fr-FR')}\nNuitées: ${tax.nights}\nAdultes: ${tax.adults}\nTarif: ${tax.taxPerNight}€/nuit\nTotal: ${tax.totalTax}€\nStatut: ${getStatusText(tax.status)}`);
                  }}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{tax.guestName}</p>
                      <p className="text-sm text-gray-600">{tax.property}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700 text-sm">
                    {new Date(tax.checkIn).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} - {new Date(tax.checkOut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-900 font-medium">{tax.nights}</td>
                  <td className="py-4 px-4 text-center text-gray-900 font-medium">{tax.adults}</td>
                  <td className="py-4 px-4 text-center text-gray-700">{tax.taxPerNight.toFixed(2)}€</td>
                  <td className="py-4 px-4 text-right font-bold text-purple-600">{tax.totalTax.toFixed(2)}€</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tax.status)}`}>
                      {getStatusText(tax.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold">
                <td colSpan={5} className="py-4 px-4 text-right text-gray-900">TOTAL À DÉCLARER :</td>
                <td className="py-4 px-4 text-right text-purple-600 text-lg">{pendingTax.toFixed(2)}€</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={() => alert('Déclaration de la taxe de séjour (fonction à venir)')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Receipt size={18} />
            Déclarer les taxes en attente
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountingModule;
