
import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import MapGandhinagar from '../components/MapGandhinagar';
import api from '../api/axiosClient';
import { ChatMessage, VictimRequest } from '../types';

const PoliceDashboard: React.FC<{ requests?: VictimRequest[] }> = ({ requests = [] }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const response = await api.get<ChatMessage[]>('/chat?channel=police');
      setMessages(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post('/chat', {
        channel: 'police',
        from: 'police',
        text: newMessage
      });
      setMessages(prev => [...prev, { from: 'police', text: newMessage, timestamp: new Date().toISOString() }]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout roleLabel="Police / NDRF / Rescue">
      <div className="space-y-8">
        <MapGandhinagar requests={requests} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-md font-bold text-slate-800 uppercase tracking-tight">Live Coordination Chat</h3>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Encrypted Channel: NDRF-SEC-01</p>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-xs font-bold text-slate-500">SECURE</span>
            </div>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.from === 'police' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                     {msg.from === 'police' ? 'NDRF (YOU)' : 'COMMANDER (ADMIN)'}
                   </span>
                   <span className="text-[9px] text-slate-300">
                     {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm font-medium ${
                    msg.from === 'police' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text"
              placeholder="Enter tactical message..."
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg transition-all">
              SEND
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PoliceDashboard;
