
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { VictimRequest } from '../types';
import api from '../api/axiosClient';
import VictimRequestCard from './VictimRequestCard';

interface Props {
  children: React.ReactElement<{ requests: VictimRequest[], inventoryUpdateTrigger: number }>;
  roleLabel: string;
}

const AdminLayout: React.FC<Props> = ({ children, roleLabel }) => {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState<VictimRequest[]>([]);
  const [inventoryUpdateTrigger, setInventoryUpdateTrigger] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const fetchRequests = async () => {
    try {
      const response = await api.get<VictimRequest[]>('/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar - Hidden on small screens, fixed width on large */}
      <aside className="hidden md:flex w-[300px] flex-shrink-0 bg-slate-900 flex-col shadow-2xl z-20">
        <div className="p-6 bg-slate-950/50 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">S</div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">SENTINEL-VAULT</h1>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Admin Console</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col p-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Victim Requests</h2>
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
              LIVE
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            {requests.map((req) => (
              <VictimRequestCard 
                key={req.id} 
                request={req} 
                showAction={user?.role === 'admin'} 
                onAllocate={(r) => {
                  window.dispatchEvent(new CustomEvent('sentinel:allocate', { detail: r }));
                }}
              />
            ))}
            {requests.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-600 text-sm">No active requests.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-950/30 border-t border-slate-800">
            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
                <span>System status</span>
                <span className="text-green-500 font-bold">OPTIMAL</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-full opacity-50"></div>
            </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-slate-800 font-bold text-sm md:text-lg truncate max-w-[150px] md:max-w-none">{roleLabel}</h2>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs md:text-sm font-semibold text-slate-900">{user?.email}</span>
              <span className="text-[9px] md:text-[10px] text-slate-400 font-medium uppercase tracking-tighter italic">Secured Session</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 flex items-center gap-2"
                title="Access from other devices"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                <span className="hidden md:inline text-xs font-bold">SHARE</span>
              </button>

              <button 
                onClick={logout}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold p-2 md:py-2 md:px-4 rounded-lg text-xs transition-colors border border-slate-200"
              >
                <span className="hidden md:inline">LOGOUT</span>
                <svg className="w-4 h-4 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {React.cloneElement(children, { 
            requests, 
            inventoryUpdateTrigger 
          })}
        </div>

        {/* Share Modal */}
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-black text-slate-900 uppercase tracking-tight">Deploy to Device</h3>
                <button onClick={() => setIsShareModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-48 h-48 bg-slate-100 border-2 border-slate-200 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden group">
                  {/* Simulated QR Code */}
                  <div className="grid grid-cols-4 gap-1 p-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    {Array.from({length: 16}).map((_, i) => (
                      <div key={i} className={`w-8 h-8 ${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-transparent'}`}></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px] pointer-events-none">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-xl">S</div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-6">
                  Scan this code or copy the link to access the <b>Sentinel-Vault</b> console from any mobile device or workstation.
                </p>

                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <input 
                      readOnly
                      value={window.location.href}
                      className="flex-1 bg-transparent text-[10px] text-slate-500 font-mono outline-none overflow-hidden text-ellipsis"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${copySuccess ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                    >
                      {copySuccess ? 'COPIED!' : 'COPY'}
                    </button>
                  </div>
                  <button 
                    onClick={() => setIsShareModalOpen(false)}
                    className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600"
                  >
                    Close Panel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLayout;
