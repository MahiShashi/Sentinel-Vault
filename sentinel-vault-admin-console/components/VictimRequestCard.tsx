
import React from 'react';
import { VictimRequest } from '../types';

interface Props {
  request: VictimRequest;
  onAllocate?: (req: VictimRequest) => void;
  showAction?: boolean;
}

const VictimRequestCard: React.FC<Props> = ({ request, onAllocate, showAction = false }) => {
  const statusColors = {
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
    URGENT: 'bg-orange-100 text-orange-700 border-orange-200',
    SAFE: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-3 transition-transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">{request.id}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[request.status]}`}>
          {request.status}
        </span>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{request.needs}</p>
        
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span>{request.peopleCount} people</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="truncate">{request.loc || 'NA'}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[10px] text-slate-400 italic">
          {new Date(request.timestamp).toLocaleTimeString()}
        </span>
        {showAction && (
          <button 
            onClick={() => onAllocate?.(request)}
            className="text-[10px] font-black bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors shadow-sm"
          >
            ALLOCATE
          </button>
        )}
      </div>
    </div>
  );
};

export default VictimRequestCard;
