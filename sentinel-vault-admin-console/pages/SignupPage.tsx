
import React, { useState } from 'react';
import api from '../api/axiosClient';
import { UserRole } from '../types';

interface Props {
  onNavigate: (page: 'login' | 'verify', email?: string) => void;
}

const SignupPage: React.FC<Props> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/signup', { email, password, role });
      onNavigate('verify', email);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-slate-950 p-6 text-center border-b border-slate-800">
          <h1 className="text-xl font-black text-white tracking-tight">ENROLL COMMANDER</h1>
          <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">Register New Sentinel Profile</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-bold">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Official Email</label>
              <input 
                type="email" 
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Confirm</label>
                <input 
                  type="password" 
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Department Role</label>
              <select 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="admin">Disaster Response Team (Admin)</option>
                <option value="police">Police / NDRF / Rescue</option>
                <option value="health">Health Department</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 mt-4"
          >
            {isLoading ? 'REGISTERING...' : 'INITIALIZE ACCOUNT'}
          </button>
          
          <div className="text-center">
            <button 
              type="button"
              onClick={() => onNavigate('login')}
              className="text-slate-400 hover:text-blue-600 text-xs font-bold"
            >
              Already verified? Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
