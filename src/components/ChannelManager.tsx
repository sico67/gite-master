
import React, { useState } from 'react';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';
import { CHANNELS, PROPERTIES } from '../services/mockData';
import { Channel } from '../types';
import { Modal } from './ui/Modal';

interface ChannelManagerProps {
    onBack?: () => void;
}

const ChannelManager: React.FC<ChannelManagerProps> = () => {
    const [channels, setChannels] = useState<Channel[]>(CHANNELS);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSyncAll = () => {
        setIsSyncing(true);
        setTimeout(() => { setIsSyncing(false); alert("Synchronisation terminée !"); }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Canaux connectés</h3>
                <div className="flex gap-2">
                    <button onClick={() => setIsModalOpen(true)} className="bg-white border px-3 py-2 rounded">+ Canal</button>
                    <button onClick={handleSyncAll} className="bg-blue-600 text-white px-3 py-2 rounded">{isSyncing ? '...' : 'Sync'}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {channels.map(channel => (
                    <div key={channel.id} className="bg-white rounded-xl shadow border p-6">
                        <h3 className="font-bold">{channel.name}</h3>
                        <div className="mt-4 space-y-2">
                             <div className="flex gap-2 items-center">
                                 <ExternalLink size={14} /> <input disabled value={channel.icalUrlImport || 'Vide'} className="bg-gray-100 flex-1 text-xs p-1" />
                             </div>
                             <div className="flex gap-2 items-center">
                                 <LinkIcon size={14} /> <input disabled value={channel.icalUrlExport} className="bg-white border flex-1 text-xs p-1" />
                             </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau Canal">
                <div className="p-4">Fonctionnalité simulée...</div>
            </Modal>
        </div>
    );
};

export default ChannelManager;
