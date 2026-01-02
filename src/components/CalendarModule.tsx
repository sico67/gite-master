
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Edit2, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isWithinInterval, startOfDay, addDays, parseISO } from 'date-fns';
import { RESERVATIONS, PROPERTIES } from '../services/mockData';
import { Reservation } from '../types';
import { Modal } from './ui/Modal';

interface CalendarModuleProps {
    targetDate?: Date | null;
    onBack?: () => void;
}

const CalendarModule: React.FC<CalendarModuleProps> = ({ targetDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [events, setEvents] = useState<Reservation[]>(RESERVATIONS);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDayDetails, setSelectedDayDetails] = useState<Date>(new Date());
  const [editingId, setEditingId] = useState<string | null>(null);

  const [blockForm, setBlockForm] = useState({
    propertyId: PROPERTIES[0].id,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    guestName: '',
    status: 'blocked' as Reservation['status']
  });

  useEffect(() => {
      if (targetDate) {
          setCurrentDate(targetDate);
          setSelectedDayDetails(targetDate);
          setIsDetailsModalOpen(true);
      }
  }, [targetDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getEventsForDay = (day: Date) => {
    return events.filter(res => {
      const isPropMatch = selectedProperty === 'all' || res.propertyId === selectedProperty;
      const start = startOfDay(res.checkIn);
      const end = startOfDay(res.checkOut);
      return isPropMatch && (isWithinInterval(day, { start, end }) || isSameDay(day, start) || isSameDay(day, end));
    });
  };

  const getEventsUpcoming = () => {
    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);
    return events.filter(res => {
        const isPropMatch = selectedProperty === 'all' || res.propertyId === selectedProperty;
        const isFuture = res.checkIn >= today;
        const isSoon = res.checkIn <= nextWeek;
        return isPropMatch && isFuture && isSoon; 
    }).sort((a,b) => a.checkIn.getTime() - b.checkIn.getTime());
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'blocked': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const handleDayClick = (day: Date) => { setSelectedDayDetails(day); setIsDetailsModalOpen(true); };
  const handleOpenAddForm = (date?: Date) => {
      const startDate = date || new Date();
      setBlockForm({ propertyId: selectedProperty !== 'all' ? selectedProperty : PROPERTIES[0].id, startDate: format(startDate, 'yyyy-MM-dd'), endDate: format(addDays(startDate, 2), 'yyyy-MM-dd'), guestName: '', status: 'blocked' });
      setEditingId(null); setIsDetailsModalOpen(false); setIsFormModalOpen(true);
  };
  const handleEditEvent = (event: Reservation) => {
      setBlockForm({ propertyId: event.propertyId, startDate: format(event.checkIn, 'yyyy-MM-dd'), endDate: format(event.checkOut, 'yyyy-MM-dd'), guestName: event.guestName, status: event.status });
      setEditingId(event.id); setIsDetailsModalOpen(false); setIsFormModalOpen(true);
  };
  const handleDeleteEvent = (id: string) => { if(window.confirm("Êtes-vous sûr ?")) setEvents(events.filter(e => e.id !== id)); };
  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newEventData: Reservation = { id: editingId || Math.random().toString(36).substr(2, 9), propertyId: blockForm.propertyId, guestName: blockForm.guestName || 'Bloqué', checkIn: parseISO(blockForm.startDate), checkOut: parseISO(blockForm.endDate), status: blockForm.status, source: 'direct' };
      if (editingId) { setEvents(events.map(e => e.id === editingId ? { ...e, ...newEventData } : e)); } else { setEvents([...events, newEventData]); }
      setIsFormModalOpen(false); setSelectedDayDetails(parseISO(blockForm.startDate)); setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
           <select 
             className="border rounded-lg px-3 py-2 bg-white text-sm"
             value={selectedProperty}
             onChange={(e) => setSelectedProperty(e.target.value)}
           >
             <option value="all">Toutes les propriétés</option>
             {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
           </select>
           <button onClick={() => handleOpenAddForm()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
             <Plus size={16} /> <span className="hidden sm:inline">Ajouter</span>
           </button>
        </div>
      </div>

      {/* MOBILE LIST */}
      <div className="md:hidden space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">Prochains 7 jours</h3>
        <div className="space-y-3">
          {getEventsUpcoming().length === 0 ? <p className="text-gray-400 italic text-sm">Rien de prévu.</p> : getEventsUpcoming().map(event => (
            <div 
              key={event.id} 
              onClick={() => handleDayClick(event.checkIn)}
              className={`p-4 rounded-lg border-l-4 shadow-sm bg-white ${getStatusColor(event.status).replace('bg-', 'border-')} cursor-pointer`}
            >
               <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900">{event.guestName}</p>
                    <p className="text-xs text-gray-500 mt-1">{PROPERTIES.find(p => p.id === event.propertyId)?.name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(event.status)}`}>{event.status}</span>
               </div>
               <div className="mt-3 flex items-center text-sm text-gray-600">
                  <CalendarIcon size={14} className="mr-2"/>
                  {format(event.checkIn, 'dd MMM')} - {format(event.checkOut, 'dd MMM')}
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP GRID */}
      <div className="hidden md:block bg-white rounded-xl shadow border border-gray-200 overflow-hidden select-none">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
            <h3 className="text-lg font-bold capitalize w-32 text-center">{format(currentDate, 'MMMM yyyy')}</h3>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[120px]">
           {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
             <div key={`empty-${i}`} className="bg-gray-50/50 border-r border-b"></div>
           ))}
           {daysInMonth.map(day => {
             const dayEvents = getEventsForDay(day);
             const isToday = isSameDay(day, new Date());
             return (
               <div 
                key={day.toString()} 
                onClick={() => handleDayClick(day)}
                className={`border-r border-b p-2 relative group hover:bg-blue-50/50 transition-colors cursor-pointer ${isToday ? 'bg-blue-50/30' : ''}`}
               >
                 <span className={`text-sm font-medium ${isToday ? 'text-blue-600 bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-700'}`}>
                   {format(day, 'd')}
                 </span>
                 <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                   {dayEvents.map(ev => (
                     <div key={ev.id} className={`text-[10px] px-1.5 py-0.5 rounded border truncate ${getStatusColor(ev.status)}`}>
                       <span className="truncate">{ev.guestName}</span>
                     </div>
                   ))}
                 </div>
               </div>
             );
           })}
        </div>
      </div>

      {/* MODALS */}
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title={`Détails`}>
          <div className="space-y-4">
              {getEventsForDay(selectedDayDetails).map(event => (
                  <div key={event.id} className="bg-white border rounded-lg p-4 shadow-sm flex justify-between items-start">
                      <div>
                          <h4 className="font-bold">{event.guestName}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(event.status)}`}>{event.status}</span>
                      </div>
                      <div className="flex gap-1">
                          <button onClick={() => handleEditEvent(event)} className="p-2 text-blue-600 bg-blue-50 rounded"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-red-600 bg-red-50 rounded"><Trash2 size={16} /></button>
                      </div>
                  </div>
              ))}
              <button onClick={() => handleOpenAddForm(selectedDayDetails)} className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold">Ajouter</button>
          </div>
      </Modal>

      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Réservation">
          <form onSubmit={handleFormSubmit} className="space-y-4">
              <div><label>Nom</label><input className="w-full border p-2 rounded" value={blockForm.guestName} onChange={e => setBlockForm({...blockForm, guestName: e.target.value})} /></div>
              <div className="flex gap-2">
                  <input className="w-full border p-2 rounded" type="date" value={blockForm.startDate} onChange={e => setBlockForm({...blockForm, startDate: e.target.value})} />
                  <input className="w-full border p-2 rounded" type="date" value={blockForm.endDate} onChange={e => setBlockForm({...blockForm, endDate: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold">Sauvegarder</button>
          </form>
      </Modal>
    </div>
  );
};

export default CalendarModule;
