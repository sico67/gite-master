import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  Calendar,
  FileText,
  Plus,
  Check,
  Clock
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'host' | 'guest';
  timestamp: string;
}

interface Conversation {
  id: string;
  guestName: string;
  guestEmail: string;
  propertyName: string;
  bookingDates: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  status: 'active' | 'archived';
  messages: Message[];
}

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  autoSend: boolean;
  trigger: 'booking_confirmed' | 'pre_arrival' | 'post_stay';
}

const MessagingModule: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      guestName: 'Marie Dubois',
      guestEmail: 'marie.dubois@email.com',
      propertyName: 'Villa Exemple',
      bookingDates: '12-19 déc 2025',
      lastMessage: 'Merci pour les informations !',
      lastMessageTime: '2025-12-07T14:30:00',
      unread: 0,
      status: 'active',
      messages: [
        {
          id: 'm1',
          text: 'Bonjour, j\'ai une question sur l\'arrivée tardive.',
          sender: 'guest',
          timestamp: '2025-12-07T10:15:00'
        },
        {
          id: 'm2',
          text: 'Bonjour Marie ! Pas de problème, vous pouvez arriver jusqu\'à 22h. Je vous enverrai le code de la boîte à clés par SMS.',
          sender: 'host',
          timestamp: '2025-12-07T10:30:00'
        },
        {
          id: 'm3',
          text: 'Merci pour les informations !',
          sender: 'guest',
          timestamp: '2025-12-07T14:30:00'
        }
      ]
    },
    {
      id: '2',
      guestName: 'Jean Martin',
      guestEmail: 'jean.martin@email.com',
      propertyName: 'Villa Exemple',
      bookingDates: '22-28 déc 2025',
      lastMessage: 'Votre réservation est confirmée !',
      lastMessageTime: '2025-12-06T16:20:00',
      unread: 1,
      status: 'active',
      messages: [
        {
          id: 'm4',
          text: 'Votre réservation est confirmée ! Au plaisir de vous accueillir.',
          sender: 'host',
          timestamp: '2025-12-06T16:20:00'
        }
      ]
    },
    {
      id: '3',
      guestName: 'Sophie Laurent',
      guestEmail: 'sophie.laurent@email.com',
      propertyName: 'Villa Exemple',
      bookingDates: '5-8 déc 2025',
      lastMessage: 'J\'espère que vous avez passé un excellent séjour !',
      lastMessageTime: '2025-12-08T11:00:00',
      unread: 0,
      status: 'active',
      messages: [
        {
          id: 'm5',
          text: 'Bonjour Sophie, j\'espère que vous avez passé un excellent séjour ! N\'hésitez pas à laisser un avis.',
          sender: 'host',
          timestamp: '2025-12-08T11:00:00'
        }
      ]
    }
  ]);

  const [templates] = useState<Template[]>([
    {
      id: 't1',
      name: 'Confirmation de réservation',
      subject: 'Votre réservation est confirmée',
      content: 'Bonjour {guest},\n\nVotre réservation pour {property} du {checkin} au {checkout} est confirmée !\n\nNous avons hâte de vous accueillir.\n\nCordialement',
      autoSend: true,
      trigger: 'booking_confirmed'
    },
    {
      id: 't2',
      name: 'Informations pré-arrivée',
      subject: 'Informations pour votre arrivée',
      content: 'Bonjour {guest},\n\nVotre arrivée approche ! Voici les informations pratiques :\n\n• Adresse : [votre adresse]\n• Check-in : à partir de 16h\n• Code boîte à clés : [code]\n\nÀ très bientôt !',
      autoSend: true,
      trigger: 'pre_arrival'
    },
    {
      id: 't3',
      name: 'Message post-séjour',
      subject: 'Merci pour votre séjour',
      content: 'Bonjour {guest},\n\nNous espérons que vous avez passé un excellent séjour !\n\nN\'hésitez pas à laisser un avis et à revenir nous voir.\n\nÀ bientôt !',
      autoSend: false,
      trigger: 'post_stay'
    }
  ]);

  const currentConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      text: messageText,
      sender: 'host',
      timestamp: new Date().toISOString()
    };

    setConversations(conversations.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageText,
          lastMessageTime: newMessage.timestamp
        };
      }
      return conv;
    }));

    setMessageText('');
  };

  const handleUseTemplate = (template: Template) => {
    if (currentConv) {
      let content = template.content
        .replace('{guest}', currentConv.guestName)
        .replace('{property}', currentConv.propertyName)
        .replace('{checkin}', currentConv.bookingDates.split('-')[0])
        .replace('{checkout}', currentConv.bookingDates.split('-')[1]);
      
      setMessageText(content);
      setShowTemplates(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `Il y a ${hours}h`;
    
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-80px)] flex bg-gray-50">
      {/* Conversations List */}
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une conversation..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {conv.guestName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{conv.guestName}</h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Calendar size={12} />
                      {conv.bookingDates}
                    </p>
                  </div>
                </div>
                {conv.unread > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {conv.unread}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate ml-15">{conv.lastMessage}</p>
              <p className="text-xs text-gray-400 mt-1 ml-15">{formatTime(conv.lastMessageTime)}</p>
            </div>
          ))}
        </div>

        {/* Templates Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <FileText size={18} />
            Templates de messages
          </button>
        </div>
      </div>

      {/* Chat Area */}
      {currentConv ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                {currentConv.guestName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="font-bold text-lg">{currentConv.guestName}</h2>
                <p className="text-sm text-blue-100">{currentConv.propertyName} • {currentConv.bookingDates}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {currentConv.messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'host' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md ${message.sender === 'host' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.sender === 'host'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${message.sender === 'host' ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Templates Panel */}
          {showTemplates && (
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-3">Choisir un template</h3>
              <div className="space-y-2">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleUseTemplate(template)}
                    className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{template.name}</span>
                      {template.autoSend && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Auto</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Écrivez votre message..."
                rows={3}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={18} />
                <span className="hidden sm:inline">Envoyer</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Appuyez sur Entrée pour envoyer, Shift+Entrée pour nouvelle ligne
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <MessageSquare size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Sélectionnez une conversation</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingModule;
