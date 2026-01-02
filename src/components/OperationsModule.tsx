
import React, { useState, useRef } from 'react';
import { ShoppingCart, PlusCircle, Trash2, Camera } from 'lucide-react';
import { INVENTORY, TICKETS, PROPERTIES } from '../services/mockData';
import { InventoryItem, MaintenanceTicket } from '../types';
import { Modal } from './ui/Modal';

interface OperationsModuleProps {
    onBack?: () => void;
}

const OperationsModule: React.FC<OperationsModuleProps> = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'maintenance'>('inventory');
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(TICKETS);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', propertyId: PROPERTIES[0].id, quantity: 1, threshold: 1, unit: 'pcs' });
  const [newTicket, setNewTicket] = useState({ title: '', description: '', propertyId: PROPERTIES[0].id, priority: 'medium' as const });
  const [ticketPhoto, setTicketPhoto] = useState<string | null>(null);
  const ticketFileInputRef = useRef<HTMLInputElement>(null);

  const lowStockItems = inventory.filter(item => item.quantity <= item.threshold);

  const handleAddItem = (e: React.FormEvent) => {
      e.preventDefault();
      setInventory([...inventory, { id: Math.random().toString(36).substr(2, 9), ...newItem }]);
      setIsItemModalOpen(false);
  };

  const handleAddTicket = (e: React.FormEvent) => {
      e.preventDefault();
      setTickets([{ id: Math.random().toString(36).substr(2, 9), ...newTicket, status: 'new', createdAt: new Date(), imageUrl: ticketPhoto || undefined }, ...tickets]);
      setIsTicketModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-gray-200">
        <button onClick={() => setActiveTab('inventory')} className={`py-3 px-4 font-medium border-b-2 ${activeTab === 'inventory' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>Stocks</button>
        <button onClick={() => setActiveTab('maintenance')} className={`py-3 px-4 font-medium border-b-2 ${activeTab === 'maintenance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>Maintenance</button>
      </div>

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4">
             <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold">Stocks</h3>
                 <button onClick={() => setIsItemModalOpen(true)} className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full">+ Article</button>
             </div>
             {inventory.map(item => (
                <div key={item.id} className="flex justify-between border-b py-2">
                    <span>{item.name}</span>
                    <span className={item.quantity <= item.threshold ? 'text-red-600 font-bold' : 'text-green-600'}>{item.quantity} {item.unit}</span>
                </div>
             ))}
          </div>
          <div className="bg-orange-50 rounded-xl p-6 h-fit">
            <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2"><ShoppingCart /> Achat</h3>
            {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between bg-white p-2 mb-2 rounded shadow-sm">
                    <span>{item.name}</span>
                    <span className="text-red-600 font-bold">-{item.threshold - item.quantity + 1}</span>
                </div>
            ))}
            <button className="w-full mt-4 bg-orange-600 text-white py-2 rounded">Générer PDF</button>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div>
           <button onClick={() => setIsTicketModalOpen(true)} className="mb-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">
              <PlusCircle size={16} /> Signaler Incident
           </button>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map(ticket => (
                 <div key={ticket.id} className="bg-white rounded p-4 shadow border">
                    <div className="flex justify-between"><h4 className="font-bold">{ticket.title}</h4><span className="text-xs bg-gray-100 p-1 rounded">{ticket.status}</span></div>
                    <p className="text-gray-600 text-sm mt-2">{ticket.description}</p>
                    {ticket.imageUrl && <img src={ticket.imageUrl} className="h-24 w-full object-cover mt-2 rounded" />}
                 </div>
              ))}
           </div>
        </div>
      )}

      <Modal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title="Ajout Stock">
          <form onSubmit={handleAddItem} className="space-y-4">
              <input placeholder="Nom" className="w-full border p-2 rounded" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Ajouter</button>
          </form>
      </Modal>
      <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title="Incident">
          <form onSubmit={handleAddTicket} className="space-y-4">
              <input placeholder="Titre" className="w-full border p-2 rounded" value={newTicket.title} onChange={e => setNewTicket({...newTicket, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full border p-2 rounded" value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})} />
              <button type="submit" className="w-full bg-red-600 text-white p-2 rounded">Signaler</button>
          </form>
      </Modal>
    </div>
  );
};

export default OperationsModule;
