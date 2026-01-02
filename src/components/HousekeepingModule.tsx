
import React, { useState, useRef } from 'react';
import { Camera, CheckCircle, Send, Phone, MessageSquare, User, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { RESERVATIONS, PROPERTIES, TICKETS } from '../services/mockData';
import { Modal } from './ui/Modal';

// --- CLEANER REPORT FORM (Mobile First - No Auth) ---
export const CleaningReportForm = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [damages, setDamages] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { 
      e.preventDefault(); 
      if (damages || photoPreview) {
          TICKETS.unshift({
            id: `t-${Date.now()}`,
            propertyId: 'p1',
            title: 'Signalement Ménage',
            description: damages || 'Anomalie signalée',
            status: 'new',
            priority: 'medium',
            createdAt: new Date(),
            imageUrl: photoPreview || undefined
        });
      }
      setStep(3); 
  };
  
  if (step === 3) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6 text-center">
        <CheckCircle size={60} className="text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-green-800 mb-2">Rapport Envoyé !</h2>
        <button onClick={onComplete} className="mt-8 px-6 py-3 bg-white border rounded-xl font-bold text-green-700">Retour Accueil</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-blue-600 px-4 py-6 text-white flex gap-4 sticky top-0 z-10 shadow-md">
        <button onClick={onComplete}><ArrowLeft /></button>
        <h1 className="font-bold text-xl">Rapport Ménage</h1>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Check-list Rapide</h3>
            <div className="space-y-2">
                {['Draps changés', 'Poubelles vidées', 'Sols nettoyés'].map(t => (
                    <label key={t} className="flex items-center gap-2">
                        <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                        <span>{t}</span>
                    </label>
                ))}
            </div>
        </div>
        <div>
            <label className="font-bold block mb-2">Anomalie / Casse ?</label>
            <textarea className="w-full border p-3 rounded-lg" placeholder="Décrivez le problème..." value={damages} onChange={e => setDamages(e.target.value)} />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            {!photoPreview ? (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 w-full border border-dashed p-4 text-gray-500 rounded-lg flex items-center justify-center gap-2"><Camera /> Ajouter Photo</button>
            ) : (
                <div className="mt-2 relative">
                    <img src={photoPreview} className="w-full h-40 object-cover rounded-lg" alt="Preview" />
                    <button type="button" onClick={() => setPhotoPreview(null)} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"><Trash2 size={16}/></button>
                </div>
            )}
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg">Envoyer Rapport</button>
      </form>
    </div>
  );
};

// --- ADMIN DASHBOARD VIEW ---
interface HousekeepingDashboardProps {
    onBack?: () => void;
}

export const HousekeepingDashboard: React.FC<HousekeepingDashboardProps> = () => {
    const [cleaners, setCleaners] = useState([
        { id: 'c1', name: 'Sophie L.', phone: '06 12 34 56 78', color: 'bg-purple-100 text-purple-700' },
        { id: 'c2', name: 'Marc D.', phone: '07 98 76 54 32', color: 'bg-teal-100 text-teal-700' }
    ]);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [newCleaner, setNewCleaner] = useState({ name: '', phone: '' });

    const handleAddCleaner = (e: React.FormEvent) => {
        e.preventDefault();
        setCleaners([...cleaners, { id: Date.now().toString(), ...newCleaner, color: 'bg-blue-100 text-blue-700' }]);
        setNewCleaner({ name: '', phone: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Suivi des Tâches</h3>
                <button onClick={() => setIsTeamModalOpen(true)} className="bg-white border px-3 py-2 rounded hover:bg-gray-50 flex gap-2 items-center"><User size={16}/> Gérer l'équipe</button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logement</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nettoyeur</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {RESERVATIONS.filter(r => r.status === 'cleaning' || r.status === 'confirmed').slice(0,3).map((res, i) => (
                            <tr key={res.id}>
                                <td className="px-6 py-4">{PROPERTIES.find(p => p.id === res.propertyId)?.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${cleaners[i%cleaners.length]?.color}`}>{cleaners[i%cleaners.length]?.name}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => setIsReminderModalOpen(true)} className="text-blue-600 font-bold text-sm hover:underline flex items-center justify-end gap-1"><Send size={14}/> Relancer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} title="Équipe de Ménage">
                <div className="space-y-4">
                    <form onSubmit={handleAddCleaner} className="flex gap-2 bg-gray-50 p-3 rounded">
                        <input required placeholder="Nom" className="flex-1 p-2 border rounded" value={newCleaner.name} onChange={e => setNewCleaner({...newCleaner, name: e.target.value})} />
                        <input required placeholder="Tél" className="w-24 p-2 border rounded" value={newCleaner.phone} onChange={e => setNewCleaner({...newCleaner, phone: e.target.value})} />
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded"><Plus /></button>
                    </form>
                    <div className="space-y-2">
                        {cleaners.map(c => (
                            <div key={c.id} className="flex justify-between items-center p-2 border rounded">
                                <div><div className="font-bold">{c.name}</div><div className="text-xs text-gray-500">{c.phone}</div></div>
                                <button onClick={() => setCleaners(cleaners.filter(x => x.id !== c.id))} className="text-red-500"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} title="Envoyer Rappel">
                <div className="space-y-4 text-center">
                    <p>Envoyer un lien magique au nettoyeur ?</p>
                    <div className="flex gap-2 justify-center">
                        <button onClick={() => { alert('SMS envoyé !'); setIsReminderModalOpen(false); }} className="bg-blue-600 text-white px-4 py-2 rounded flex gap-2"><MessageSquare /> SMS</button>
                        <button onClick={() => { alert('WhatsApp envoyé !'); setIsReminderModalOpen(false); }} className="bg-green-600 text-white px-4 py-2 rounded flex gap-2"><Phone /> WhatsApp</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
