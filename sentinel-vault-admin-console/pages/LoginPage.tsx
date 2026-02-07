
import React, { useState } from 'react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

interface Props {
  onNavigate: (page: 'signup' | 'verify', email?: string) => void;
}

const LoginPage: React.FC<Props> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-slate-950 p-8 text-center border-b border-slate-800">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center transform -rotate-6 shadow-xl">
             <span className="text-3xl font-black text-white">S</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">SENTINEL-VAULT</h1>
          <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mt-1">Secure Emergency Control Panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-slate-800"
                placeholder="commander@sentinel.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-slate-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50"
          >
            {isLoading ? 'AUTHENTICATING...' : 'SECURE LOGIN'}
          </button>
          
          <div className="text-center pt-2">
            <button 
              type="button"
              onClick={() => onNavigate('signup')}
              className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors"
            >
              Create new commander account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
