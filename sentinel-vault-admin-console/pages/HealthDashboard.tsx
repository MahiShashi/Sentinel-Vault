
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import MapGandhinagar from '../components/MapGandhinagar';
import api from '../api/axiosClient';
import { HealthInventoryItem, VictimRequest } from '../types';

const HealthDashboard: React.FC<{ requests?: VictimRequest[] }> = ({ requests = [] }) => {
  const [inventory, setInventory] = useState<HealthInventoryItem[]>([]);

  useEffect(() => {
    const fetchHealthInventory = async () => {
      try {
        const response = await api.get<HealthInventoryItem[]>('/health-inventory');
        setInventory(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHealthInventory();
  }, []);

  return (
    <AdminLayout roleLabel="Health & Medical Center">
      <div className="space-y-8">
        <MapGandhinagar requests={requests} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Medical Resources</h3>
              <p className="text-sm text-slate-500">Critical supply chain and health metrics</p>
            </div>
            <div className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-200">
               Stock Alerts Active
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Available</th>
                  <th className="px-6 py-4">Needed</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {inventory.map((item, idx) => {
                  const shortage = item.available < item.needed;
                  return (
                    <tr key={idx} className={`transition-colors ${shortage ? 'bg-red-50/30' : 'hover:bg-slate-50'}`}>
                      <td className="px-6 py-4 font-semibold text-slate-700">{item.name}</td>
                      <td className={`px-6 py-4 font-bold ${shortage ? 'text-red-600' : 'text-slate-900'}`}>
                        {item.available} {item.unit}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{item.needed} {item.unit}</td>
                      <td className="px-6 py-4">
                        {shortage ? (
                          <span className="text-[10px] font-black text-red-600 bg-red-100 px-2 py-1 rounded uppercase">CRITICAL SHORTAGE</span>
                        ) : (
                          <span className="text-[10px] font-black text-green-600 bg-green-100 px-2 py-1 rounded uppercase">ADEQUATE</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HealthDashboard;
