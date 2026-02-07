import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import MapGandhinagar from '../components/MapGandhinagar';
import api from '../api/axiosClient';
import { InventoryItem, VictimRequest } from '../types';

interface AllocationState {
  request: VictimRequest | null;
  items: { [key: string]: number };
}

const DisasterDashboard: React.FC<{ requests?: VictimRequest[], inventoryUpdateTrigger?: number }> = ({ 
  requests = [], 
  inventoryUpdateTrigger = 0 
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [allocation, setAllocation] = useState<AllocationState>({ request: null, items: {} });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      const response = await api.get<InventoryItem[]>('/inventory');
      setInventory(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [inventoryUpdateTrigger]);

  useEffect(() => {
    const handleAllocateEvent = (e: any) => {
      setAllocation({ request: e.detail, items: {} });
    };
    window.addEventListener('sentinel:allocate', handleAllocateEvent);
    return () => window.removeEventListener('sentinel:allocate', handleAllocateEvent);
  }, []);

  const handleAllocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocation.request) return;

    setIsSubmitting(true);
    try {
      // Fix: Explicitly cast Object.entries to resolve 'unknown' type inference issue in TypeScript for the filter operator
      const payload = (Object.entries(allocation.items) as [string, number][])
        .filter(([_, qty]) => qty > 0)
        .map(([name, quantity]) => ({ name, quantity }));

      await api.post(`/requests/${allocation.request.id}/allocate`, { allocations: payload });
      alert(`Success: Resources allocated to ${allocation.request.id}`);
      setAllocation({ request: null, items: {} });
      fetchInventory(); // Update inventory levels
    } catch (err) {
      alert('Allocation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout roleLabel="Disaster Response Command">
      <div className="space-y-8">
        <MapGandhinagar requests={requests} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Rescue Inventory</h3>
              <p className="text-sm text-slate-500">Live logistics and resource tracking</p>
            </div>
            <div className="text-right">
                <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-1 rounded uppercase tracking-widest">Global Ops</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Quantity Available</th>
                  <th className="px-6 py-4">Unit</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {inventory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">{item.name}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{item.quantity}</td>
                    <td className="px-6 py-4 text-slate-500">{item.unit}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
                      <span className="text-xs font-medium text-slate-600">Ready</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocation Modal */}
        {allocation.request && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-900 p-6 flex justify-between items-center border-b border-slate-800">
                <div>
                  <h4 className="text-white font-black uppercase tracking-tight">Resource Allocation</h4>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">{allocation.request.id} Context</p>
                </div>
                <button 
                  onClick={() => setAllocation({ request: null, items: {} })}
                  className="text-slate-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <form onSubmit={handleAllocationSubmit} className="p-6">
                <div className="mb-6 space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Victim Needs</p>
                  <p className="text-lg font-bold text-slate-800">{allocation.request.needs}</p>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                  {inventory.map(item => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.name}</p>
                        <p className="text-[10px] text-slate-400">Available: {item.quantity} {item.unit}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input 
                          type="number"
                          min="0"
                          max={item.quantity}
                          placeholder="0"
                          className="w-20 p-2 text-center text-sm font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={allocation.items[item.name] || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setAllocation(prev => ({
                              ...prev,
                              items: { ...prev.items, [item.name]: val }
                            }));
                          }}
                        />
                        <span className="text-xs text-slate-400 w-10">{item.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setAllocation({ request: null, items: {} })}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-xl transition-all"
                  >
                    CANCEL
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'PROCESSING...' : 'CONFIRM ALLOCATION'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DisasterDashboard;