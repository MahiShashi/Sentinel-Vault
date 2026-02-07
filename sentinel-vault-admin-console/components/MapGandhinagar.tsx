
import React, { useEffect, useRef } from 'react';
import { VictimRequest } from '../types';

interface Props {
  requests: VictimRequest[];
}

declare const L: any;

const MapGandhinagar: React.FC<Props> = ({ requests }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      // Initialize map centered on Gandhinagar
      mapRef.current = L.map(mapContainerRef.current).setView([23.2156, 72.6369], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; Sentinel-Vault Ops'
      }).addTo(mapRef.current);
    }

    // Update markers when requests change
    if (mapRef.current) {
      // Clear existing markers
      markersRef.current.forEach(m => mapRef.current.removeLayer(m));
      markersRef.current = [];

      requests.forEach(req => {
        const [lat, lng] = req.loc.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          const color = req.status === 'CRITICAL' ? '#ef4444' : (req.status === 'URGENT' ? '#f97316' : '#22c55e');
          
          const marker = L.circleMarker([lat, lng], {
            radius: 10,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(mapRef.current);

          marker.bindPopup(`
            <div class="text-xs">
              <p class="font-bold text-blue-400 mb-1">${req.id}</p>
              <p class="mb-1"><b>Status:</b> ${req.status}</p>
              <p><b>Needs:</b> ${req.needs}</p>
            </div>
          `);

          markersRef.current.push(marker);
        }
      });
    }

    return () => {
      // Map cleanup if component unmounts
    };
  }, [requests]);

  return (
    <div className="relative w-full h-96 rounded-xl shadow-inner border-2 border-slate-300 overflow-hidden bg-slate-200">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-lg text-[10px] font-bold uppercase tracking-wider space-y-2">
        <div className="flex items-center gap-2 text-red-600">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> CRITICAL
        </div>
        <div className="flex items-center gap-2 text-orange-600">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> URGENT
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> SAFE
        </div>
      </div>
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/80 text-white px-3 py-1 rounded text-[10px] uppercase font-black tracking-widest">
        LIVE OPS TRACKING ENABLED
      </div>
    </div>
  );
};

export default MapGandhinagar;
