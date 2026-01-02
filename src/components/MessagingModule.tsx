
import React, { useState } from 'react';
import { MessageSquare, Zap, Send, Search, Clock, CheckCircle, Edit3, Plus, ArrowLeft, Settings, User } from 'lucide-react';
import { CONVERSATIONS, MESSAGES, TEMPLATES, PROPERTIES } from '../services/mockData';
import { Conversation, Message, MessageTemplate } from '../types';
import { Modal } from './ui/Modal';
import { format } from 'date-fns';

interface MessagingModuleProps {
    onBack?: () => void;
}

const MessagingModule: React.FC<MessagingModuleProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'inbox' | 'automation'>('inbox');
    
    // INBOX STATE
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [localMessages, setLocalMessages] = useState<Message[]>(MESSAGES);
    const [localConversations, setLocalConversations] = useState<Conversation[]>(CONVERSATIONS);

    // AUTOMATION STATE
    const [templates, setTemplates] = useState<MessageTemplate[]>(TEMPLATES);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);

    // -- INBOX LOGIC --
    const selectedConversation = localConversations.find(c => c.id === selectedConversationId);
    const currentMessages = localMessages.filter(m => m.conversationId === selectedConversationId);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversationId) return;

        const msg: Message = {
            id: Date.now().toString(),
            conversationId: selectedConversationId,
            sender: 'host',
            content: newMessage,
            timestamp: new Date(),
            read: true
        };

        setLocalMessages([...localMessages, msg]);
        setNewMessage('');
        
        // Update conversation preview
        setLocalConversations(localConversations.map(c => 
            c.id === selectedConversationId 
                ? { ...c, lastMessage: newMessage, lastMessageDate: new Date(), unreadCount: 0 } 
                : c
        ));
    };

    const getSourceBadge = (source: string) => {
        switch(source) {
            case 'airbnb': return <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Airbnb</span>;
            case 'booking': return <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Booking</span>;
            default: return <span className="text-[10px] font-bold text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">Direct</span>;
        }
    };

    // -- AUTOMATION LOGIC --
    const handleSaveTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTemplate) return;

        if (templates.find(t => t.id === editingTemplate.id)) {
            setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
        } else {
            setTemplates([...templates, { ...editingTemplate, id: Date.now().toString() }]);
        }
        setIsTemplateModalOpen(false);
    };

    const insertVariable = (variable: string) => {
        if (editingTemplate) {
            setEditingTemplate({
                ...editingTemplate,
                content: editingTemplate.content + variable
            });
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            {/* HEADER AVEC BOUTON RETOUR */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Messagerie</h2>
                        <p className="text-sm text-gray-500">Centralisation & Automatisations</p>
                    </div>
                </div>
                
                <div className="bg-white p-1 rounded-lg border flex">
                    <button 
                        onClick={() => setActiveTab('inbox')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'inbox' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <MessageSquare size={16} /> Boîte de réception
                    </button>
                    <button 
                        onClick={() => setActiveTab('automation')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'automation' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Zap size={16} /> Automatisations
                    </button>
                </div>
            </div>

            {/* --- VIEW: INBOX --- */}
            {activeTab === 'inbox' && (
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex">
                    {/* Conversation List */}
                    <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
                        <div className="p-4 border-b">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input type="text" placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {localConversations.map(conv => (
                                <div 
                                    key={conv.id}
                                    onClick={() => setSelectedConversationId(conv.id)}
                                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${selectedConversationId === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-bold text-sm ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-600'}`}>{conv.guestName}</h4>
                                        <span className="text-xs text-gray-400">{format(conv.lastMessageDate, 'HH:mm')}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs text-gray-500 line-clamp-1 flex-1 mr-2">{conv.lastMessage}</p>
                                        {conv.unreadCount > 0 && <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 rounded-full">{conv.unreadCount}</span>}
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        {getSourceBadge(conv.source)}
                                        <span className="text-[10px] text-gray-400 truncate">{PROPERTIES.find(p => p.id === conv.propertyId)?.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="hidden md:flex flex-col flex-1 bg-gray-50/50">
                        {selectedConversation ? (
                            <>
                                <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{selectedConversation.guestName}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                {PROPERTIES.find(p => p.id === selectedConversation.propertyId)?.name}
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                Arrivée dans 2 jours
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600"><Settings size={20} /></button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {currentMessages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'host' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${
                                                msg.sender === 'host' ? 'bg-blue-600 text-white rounded-br-none' : 
                                                msg.sender === 'system' ? 'bg-gray-200 text-gray-600 text-xs text-center w-full shadow-none bg-transparent my-2' : 
                                                'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                            }`}>
                                                {msg.sender !== 'system' && <p className="text-sm">{msg.content}</p>}
                                                {msg.sender === 'system' && <p>----- {msg.content} -----</p>}
                                                {msg.sender !== 'system' && <p className={`text-[10px] mt-1 text-right ${msg.sender === 'host' ? 'text-blue-100' : 'text-gray-400'}`}>
                                                    {format(msg.timestamp, 'HH:mm')}
                                                </p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Écrivez votre message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <MessageSquare size={48} className="mb-4 opacity-20" />
                                <p>Sélectionnez une conversation</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- VIEW: AUTOMATION --- */}
            {activeTab === 'automation' && (
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Add New Card */}
                        <button 
                            onClick={() => {
                                setEditingTemplate({
                                    id: '',
                                    title: 'Nouveau Modèle',
                                    trigger: 'booking_confirmed',
                                    daysOffset: 0,
                                    content: '',
                                    isActive: true
                                });
                                setIsTemplateModalOpen(true);
                            }}
                            className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all group min-h-[200px]"
                        >
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <span className="font-bold">Créer une automatisation</span>
                        </button>

                        {/* Template Cards */}
                        {templates.map(tpl => (
                            <div key={tpl.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${tpl.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{tpl.title}</h3>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={10} />
                                                {tpl.trigger === 'booking_confirmed' ? 'Immédiat (Résa)' : 
                                                 tpl.trigger === 'before_checkin' ? `${Math.abs(tpl.daysOffset)}j avant arrivée` :
                                                 `${tpl.daysOffset}j après départ`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input type="checkbox" checked={tpl.isActive} readOnly className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-green-400"/>
                                        <label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${tpl.isActive ? 'bg-green-400' : 'bg-gray-300'}`}></label>
                                    </div>
                                </div>
                                
                                <div className="flex-1 bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-600 italic border overflow-hidden relative">
                                    <p className="line-clamp-4">{tpl.content}</p>
                                    <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-gray-50 to-transparent"></div>
                                </div>

                                <button 
                                    onClick={() => { setEditingTemplate(tpl); setIsTemplateModalOpen(true); }}
                                    className="w-full py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit3 size={16} /> Modifier
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MODAL EDIT TEMPLATE */}
            <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} title="Configurer le Message">
                {editingTemplate && (
                    <form onSubmit={handleSaveTemplate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'automatisation</label>
                            <input 
                                required
                                className="w-full border rounded-lg p-2"
                                value={editingTemplate.title}
                                onChange={e => setEditingTemplate({...editingTemplate, title: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Déclencheur</label>
                                <select 
                                    className="w-full border rounded-lg p-2 bg-white"
                                    value={editingTemplate.trigger}
                                    onChange={e => setEditingTemplate({...editingTemplate, trigger: e.target.value as any})}
                                >
                                    <option value="booking_confirmed">Nouvelle Réservation</option>
                                    <option value="before_checkin">Avant Arrivée</option>
                                    <option value="after_checkout">Après Départ</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Délai (Jours)</label>
                                <input 
                                    type="number"
                                    className="w-full border rounded-lg p-2"
                                    value={editingTemplate.daysOffset}
                                    onChange={e => setEditingTemplate({...editingTemplate, daysOffset: parseInt(e.target.value)})}
                                    disabled={editingTemplate.trigger === 'booking_confirmed'}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu du message</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {['{{guest_name}}', '{{check_in}}', '{{property_name}}', '{{wifi_code}}'].map(variable => (
                                    <button 
                                        type="button"
                                        key={variable}
                                        onClick={() => insertVariable(variable)}
                                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100"
                                    >
                                        {variable}
                                    </button>
                                ))}
                            </div>
                            <textarea 
                                required
                                rows={8}
                                className="w-full border rounded-lg p-3 font-mono text-sm"
                                value={editingTemplate.content}
                                onChange={e => setEditingTemplate({...editingTemplate, content: e.target.value})}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="active"
                                checked={editingTemplate.isActive}
                                onChange={e => setEditingTemplate({...editingTemplate, isActive: e.target.checked})}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <label htmlFor="active" className="text-sm text-gray-700">Activer cette automatisation immédiatement</label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                             <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Annuler</button>
                             <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Sauvegarder</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default MessagingModule;
