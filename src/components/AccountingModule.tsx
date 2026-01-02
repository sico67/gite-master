
import React, { useState, useRef } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, FileText, Download, ArrowLeft, Camera, Trash2, PieChart } from 'lucide-react';
import { PROPERTIES, EXPENSES, RESERVATIONS } from '../services/mockData';
import { Expense, Reservation } from '../types';
import { Modal } from './ui/Modal';
import { format } from 'date-fns';

interface AccountingModuleProps {
    onBack?: () => void;
}

const AccountingModule: React.FC<AccountingModuleProps> = ({ onBack }) => {
    const [expenses, setExpenses] = useState<Expense[]>(EXPENSES);
    const [selectedProperty, setSelectedProperty] = useState<string>('all');
    
    // Modal & Form State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({
        propertyId: PROPERTIES[0].id,
        category: 'maintenance' as Expense['category'],
        description: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd')
    });
    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- CALCULATIONS ---
    const filteredExpenses = expenses.filter(e => selectedProperty === 'all' || e.propertyId === selectedProperty);
    const filteredReservations = RESERVATIONS.filter(r => 
        r.status === 'confirmed' && (selectedProperty === 'all' || r.propertyId === selectedProperty)
    );

    const totalRevenue = filteredReservations.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

    // Merge transactions for list
    const transactions = [
        ...filteredReservations.map(r => ({
            id: r.id,
            type: 'income',
            description: `Réservation: ${r.guestName}`,
            amount: r.totalPrice || 0,
            date: r.checkIn,
            category: 'rental'
        })),
        ...filteredExpenses.map(e => ({
            id: e.id,
            type: 'expense',
            description: e.description,
            amount: e.amount,
            date: e.date,
            category: e.category
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    // --- HANDLERS ---
    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        const expense: Expense = {
            id: Date.now().toString(),
            propertyId: newExpense.propertyId,
            category: newExpense.category,
            description: newExpense.description,
            amount: parseFloat(newExpense.amount),
            date: new Date(newExpense.date),
            receiptUrl: receiptPreview || undefined
        };
        setExpenses([expense, ...expenses]);
        setIsAddModalOpen(false);
        setNewExpense({ ...newExpense, description: '', amount: '', date: format(new Date(), 'yyyy-MM-dd') });
        setReceiptPreview(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setReceiptPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleExport = () => {
        alert("Export Excel/CSV généré et téléchargé !");
    };

    return (
        <div className="space-y-6">
            {/* Header avec Bouton Retour */}
            <div className="bg-gray-900 text-white p-4 rounded-xl shadow-md flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold">Finance & Comptabilité</h2>
                        <p className="text-gray-400 text-sm">Suivi de trésorerie</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <select 
                        className="bg-gray-800 text-white border-none rounded-lg text-sm px-3 py-2 outline-none"
                        value={selectedProperty}
                        onChange={(e) => setSelectedProperty(e.target.value)}
                    >
                        <option value="all">Toutes les propriétés</option>
                        {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase">Revenus</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(2)} €</p>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                        <div className="bg-red-100 p-2 rounded-lg text-red-600">
                            <TrendingDown size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase">Dépenses</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalExpenses.toFixed(2)} €</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <PieChart size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase">Bénéfice Net</span>
                    </div>
                    <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {netProfit.toFixed(2)} €
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Marge: {profitMargin}%</p>
                </div>
            </div>

            {/* ACTIONS & LIST */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-gray-800">Historique des Transactions</h3>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                            onClick={handleExport}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Download size={16} /> Export
                        </button>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                            <Plus size={16} /> Ajouter Dépense
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Catégorie</th>
                                <th className="px-6 py-3 text-right">Montant</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((t, idx) => (
                                <tr key={`${t.type}-${t.id}-${idx}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-600 font-medium">
                                        {format(t.date, 'dd/MM/yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">
                                        {t.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                            t.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {t.type === 'income' ? 'Revenu' : t.category}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)} €
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL AJOUT DEPENSE */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Ajouter une Dépense">
                <form onSubmit={handleAddExpense} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Propriété</label>
                        <select 
                            className="w-full border rounded-lg p-2.5 bg-gray-50"
                            value={newExpense.propertyId}
                            onChange={e => setNewExpense({...newExpense, propertyId: e.target.value})}
                        >
                            {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input 
                                type="date" required
                                className="w-full border rounded-lg p-2.5"
                                value={newExpense.date}
                                onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
                            <input 
                                type="number" step="0.01" required placeholder="0.00"
                                className="w-full border rounded-lg p-2.5"
                                value={newExpense.amount}
                                onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                        <select 
                            className="w-full border rounded-lg p-2.5 bg-gray-50"
                            value={newExpense.category}
                            onChange={e => setNewExpense({...newExpense, category: e.target.value as any})}
                        >
                            <option value="maintenance">Maintenance & Réparations</option>
                            <option value="supplies">Consommables & Stock</option>
                            <option value="utilities">Factures (Eau/Elec/Internet)</option>
                            <option value="tax">Impôts & Taxes</option>
                            <option value="other">Autre</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input 
                            type="text" required placeholder="Ex: Remplacement Ampoules"
                            className="w-full border rounded-lg p-2.5"
                            value={newExpense.description}
                            onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                        />
                    </div>

                    {/* PHOTO RECU */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reçu / Facture (Photo)</label>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        
                        {!receiptPreview ? (
                            <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:bg-gray-50 hover:border-blue-400 flex items-center justify-center gap-2"
                            >
                                <Camera size={20} /> Ajouter une photo
                            </button>
                        ) : (
                            <div className="relative h-32 w-full rounded-lg overflow-hidden border">
                                <img src={receiptPreview} alt="Receipt" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => { setReceiptPreview(null); if(fileInputRef.current) fileInputRef.current.value=""; }}
                                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-sm mt-4"
                    >
                        Enregistrer Dépense
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AccountingModule;
